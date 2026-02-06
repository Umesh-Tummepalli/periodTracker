import express from 'express'
import { UserAuth } from '../middlewares/auth.js';
import Question from '../models/Questions.js';
import upload from '../middlewares/multer.js';
import comments from './comments.js';
import User from '../models/User.js';
import { uploadMedia, cleanupLocalFiles } from '../utils/uploadHandler.js';
const router = express.Router();

export async function fetchAnonymousNames(userIds) {
    const users = await User.find({ _id: { $in: userIds } });
    const names = users.map(user => user.anonymousName);
    return names;
}
router.post('/', UserAuth, upload.fields([{
    name: "images", maxCount: 10
}, {
    name: "videos", maxCount: 2
}]), async (req, res) => {
    const userId = req.userId || "";
    const { question, description } = req.body;
    const images = req.files.images || [];
    const videos = req.files.videos || [];

    try {
        if (!question || !description) {
            return res.status(400).json({ message: "Question and description are required", success: false });
        }

        const { imgs, vids } = await uploadMedia(images, videos);

        const questionData = new Question({ question, description, authorId: userId, images: imgs, videos: vids });
        await questionData.save();
        res.status(200).json({ message: "Question posted successfully", success: true, questionId: questionData._id });

    } catch (error) {
        console.log("Question save/upload error:", error);
        res.status(500).json({ message: "Question save/upload error", success: false });
    } finally {
        await cleanupLocalFiles([...images, ...videos]);
    }
});


router.get('/user/:userId', UserAuth, async (req, res) => {
    const userId = req.params.userId || req.userId || "";
    try {
        const questions = await Question.find({ authorId: userId }).populate("authorId");
        const userIds = questions.map(question => question.authorId);
        const names = await fetchAnonymousNames(userIds);
        questions.forEach((question, index) => {
            question.anonymousName = names[index];
            question.authorId = undefined;
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
    try {
        const question = await Question.findById(questionId);
        const userIds = [question.authorId];
        const names = await fetchAnonymousNames(userIds);
        const temp = JSON.parse(JSON.stringify(question));
        temp.anonymousName = names[0];
        temp.authorId = undefined;
        res.status(200).json({ message: "Question fetched successfully", success: true, question: temp });
    } catch (error) {
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});

router.use('/:questionId/comments', comments);

router.get('/feed', UserAuth, async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    try {
        const questions = await Question.find().skip(start - 1).limit(10);
        const userIds = questions.map(question => question.authorId);
        const names = await fetchAnonymousNames(userIds);
        questions.forEach((question, index) => {
            question.anonymousName = names[index];
        })
        res.status(200).json({ message: "Questions fetched successfully", success: true, questions });
    } catch (error) {
        console.log("Question fetch error:", error);
        return res.status(500).json({ message: "Question fetch error", success: false });
    }
});
export default router;