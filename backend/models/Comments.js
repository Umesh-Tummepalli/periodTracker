import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    media:{
        type: [String],
        required: false
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    anonymousName: {
        type: String,
        default: "anonymous"
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
},{timestamps:true})

const Comment = mongoose.model.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;