import mongoose from "mongoose";

const PostLikeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }
},{timestamps:true})

const PostLike = mongoose.model.PostLike || mongoose.model("PostLike", PostLikeSchema);

export default PostLike;
