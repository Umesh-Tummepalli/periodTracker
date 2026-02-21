import express from "express";
import upload from "../middlewares/multer.js";
import { uploadMedia, cleanupLocalFiles } from "../utils/uploadHandler.js";
import Comment from "../models/Comments.js";
import { UserAuth } from "../middlewares/auth.js";
import { fetchAnonymousNames } from "./quora.js";
import { ObjectId } from "mongodb";

const router = express.Router({ mergeParams: true });


router.post("/add", UserAuth, upload.fields([{ name: "images", maxCount: 2 }, { name: "videos", maxCount: 2 }]), async (req, res) => {
    const { comment, parentCommentId } = req.body;
    const questionId = req.params.questionId;
    console.log(questionId, parentCommentId);
    const userId = req.userId;
    const images = req.files.images || [];
    const videos = req.files.videos || [];

    try {
        const { imgs, vids } = await uploadMedia(images, videos);
        const commentData = new Comment({
            comment,
            questionId,
            authorId: userId,
            images: imgs,
            videos: vids
        });

        if (parentCommentId && parentCommentId !== "null") {
            commentData.parentCommentId = parentCommentId;
        }
        await commentData.save();
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.log("Upload/Save error:", error);
        res.status(500).json({ message: "Error adding comment", success: false });
    } finally {
        await cleanupLocalFiles([...images, ...videos]);
    }
});


async function getChildren(commentId) {
    const childComments = await Comment.find({ parentCommentId: commentId }).populate("authorId", "anonymousName").lean();
    for await (const childComment of childComments) {
        const grandChildComments = await getChildren(childComment._id);
        childComment.childComments = grandChildComments;
    }
    return childComments;
}
router.get('/', UserAuth, async (req, res) => {
    const questionId = req.params.questionId;
    try {
        const mainComments = await Comment
            .find(
                { questionId, parentCommentId: null }
            )
            .populate("authorId", "anonymousName")
            .lean();
        for await (const comment of mainComments) {
            const childComments = await getChildren(comment._id);
            comment.childComments = childComments;
        }
        res.status(200).json({ message: "Comments fetched successfully", success: true, comments: mainComments });
    } catch (error) {
        console.log("Comment fetch error:", error);
        return res.status(500).json({ message: "Comment fetch error", success: false });
    }
})

export default router;