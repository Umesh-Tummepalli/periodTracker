import express from 'express'
import { UserAuth } from '../middlewares/auth.js';
import Question from '../models/Questions.js';
import cloudinary from '../config/cloudinary.js';
import upload from '../middlewares/multer.js';
import cloudinaryDelete from '../utils/cloudinaryDelete.js';
import comments from './comments.js';
import User from '../models/User.js';
import path from 'path';
const router = express.Router();

async function fetchAnonymousNames(userIds){
    const users=await User.find({ _id: { $in: userIds } });
    const names=users.map(user=>user.anonymousName);
    return names;   
}
import fs from 'fs/promises';

async function cleanFiles(files) {
    for (const file of files) {
        try {
            await fs.access(file.path);
            await fs.unlink(file.path);
        } catch (error) {
            // File does not exist or cannot be accessed
        }
    }
}
router.post('/', UserAuth, upload.fields([{
    name: "images", maxCount: 10
}, {
    name: "videos", maxCount: 2
}]), async (req, res) => {
    const userId = req.userId || "";
    const { question, description } = req.body;
    const  images = req.files.images || [];
    const  videos = req.files.videos || [];
    const imgs = [];
    const vids = [];
    for await (const image of images){
        try{
            const uploadData= await cloudinary.uploader.upload( image.path,{
                resource_type:"image"
            });
            imgs.push({ url: uploadData.secure_url, publicId: uploadData.public_id });
        }catch(error){
            await cleanFiles(images);
            await cleanFiles(videos);
            cloudinaryDelete(imgs.map(img => img.publicId), vids.map(video => video.publicId));
            console.log("Image upload error:", error);
            return res.status(500).json({ message: "Image upload error", success: false });
        }
    }
    for await (const video of videos){
        try{
            const uploadData= await cloudinary.uploader.upload( path.join(process.cwd(),video.path), {
                resource_type:"video"
            });
            vids.push({ url: uploadData.secure_url, publicId: uploadData.public_id });
        }catch(error){
            await cleanFiles(images);
            await cleanFiles(videos);
            cloudinaryDelete(imgs.map(img => img.publicId), vids.map(video => video.publicId));
            console.log("Video upload error:", error);
            return res.status(500).json({ message: "Video upload error", success: false });
        }
    }
    if (!question || !description) {
        cloudinaryDelete(imgs.map(img => img.publicId), vids.map(video => video.publicId));
        return res.status(400).json({ message: "Question and description are required", success: false });
    }
    const questionData = new Question({ question, description, authorId: userId, images: imgs, videos: vids });
    try{
        await questionData.save();
    }catch(error){
        cloudinaryDelete(imgs.map(img => img.publicId), vids.map(video => video.publicId));
        console.log("Question save error:", error);
        return res.status(500).json({ message: "Question save error", success: false });
    }
    finally{
        await cleanFiles(images);
        await cleanFiles(videos);
    }
    res.status(200).json({ message: "Question posted successfully", success: true,questionId:questionData._id });
});


router.get('/user/:userId', UserAuth, async (req, res) => {
    const userId = req.params.userId || req.userId || "";
    try {
        const questions = await Question.find({ authorId: userId }).populate("authorId");
        const userIds=questions.map(question=>question.authorId);
        const names=await fetchAnonymousNames(userIds);
        questions.forEach((question,index)=>{
            question.anonymousName=names[index];    
            question.authorId=undefined;
        })
        res.status(200).json({ message: "Questions fetched successfully", success: true, questions });
    } catch (error) {
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});



router.get('/user/me', UserAuth, async (req, res) => {
    const userId = req.userId || "";
    try {
        const questions = await Question.find({ authorId: userId }).populate("authorId");
        res.status(200).json({ message: "Questions fetched successfully", success: true, questions });
    } catch (error) {
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});


router.get('/:questionId', UserAuth, async (req, res) => {
    const questionId = req.params.questionId || "";
    try{
        const question = await Question.findById(questionId);
        const userIds=[question.authorId];
        const names=await fetchAnonymousNames(userIds);
        const temp=JSON.parse(JSON.stringify(question));
        temp.anonymousName=names[0];
        temp.authorId=undefined;
        res.status(200).json({ message: "Question fetched successfully", success: true, question:temp });
    }catch(error){
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});

router.use('/:questionId/comments',comments);

router.get('/feed', UserAuth, async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    try {
        const questions = await Question.find().skip(start-1).limit(10);
        const userIds=questions.map(question=>question.authorId);
        const names=await fetchAnonymousNames(userIds);
        questions.forEach((question,index)=>{
            question.anonymousName=names[index];
        })
        res.status(200).json({ message: "Questions fetched successfully", success: true, questions });
    } catch (error) {
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});
export default router;