import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
     images: {
      type: [{ url: String, publicId: String }],
      required: false,
    },
    videos: {
      type: [{ url: String, publicId: String }],
      required: false,  
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: false
    },
},{timestamps:true})

const Comment = mongoose.model.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;