import express from "express";
import upload from "../middlewares/multer.js";
import { uploadMedia, cleanupLocalFiles } from "../utils/uploadHandler.js";
import Comment from "../models/Comments.js";
import { UserAuth } from "../middlewares/auth.js";
const router = express.Router({ mergeParams: true });
import { fetchAnonymousNames } from "./quora.js";
router.post("/add", UserAuth, upload.fields([{ name: "images", maxCount: 2 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
    const { comment, parentCommentId } = req.body;
    const questionId = req.params.questionId;
    const userId = req.userId;
    const images = req.files.images || [];
    const videos = req.files.videos || [];

    try {
        const { imgs, vids } = await uploadMedia(images, videos);

        const commentData = new Comment({ comment, questionId, parentCommentId, authorId: userId, images: imgs, videos: vids });
        await commentData.save();
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.log("Upload/Save error:", error);
        res.status(500).json({ message: "Error adding comment", success: false });
    } finally {
        await cleanupLocalFiles([...images, ...videos]);
    }
});
router.get('/',UserAuth,async(req,res)=>{
    const questionId = req.params.questionId;
    try {
        const commentIds = await Comment.find({questionId,parentCommentId:null}).populate("authorId").select("_id");
        const ids=commentIds.map(comment=>comment._id);

        res.status(200).json({ message: "commentIds fetched successfully", success: true, commentIds:ids });
    } catch (error) {
        console.log("Comment fetch error:", error);
        return res.status(500).json({ message: "Comment fetch error", success: false });
    }
})
router.get('/:commentId',UserAuth,async(req,res)=>{
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findById(commentId);
        const userIds = [comment.authorId];
        const names = await fetchAnonymousNames(userIds);
        const temp = JSON.parse(JSON.stringify(comment));
        const commentIds = await Comment.find({parentCommentId:commentId}).populate("authorId").select("_id");
        const ids=commentIds.map(comment=>comment._id);
        temp.childCommentIds = ids;
        temp.anonymousName = names[0];
        temp.authorId = undefined;
        res.status(200).json({ message: "Comment fetched successfully", success: true, comment: temp });
    } catch (error) {
        console.log("Comment fetch error:", error);
        return res.status(500).json({ message: "Comment fetch error", success: false });
    }
})
export default router;