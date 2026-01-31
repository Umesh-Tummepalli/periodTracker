import mongoose from "mongoose";

const CommentLikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }
},{timestamps:true})

const CommentLike = mongoose.model.CommentLike || mongoose.model("CommentLike", CommentLikeSchema);

export default CommentLike;
