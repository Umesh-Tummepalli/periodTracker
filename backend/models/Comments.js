import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, "Comment content is required"]
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
        required: [true, "Author ID is required"]
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: [true, "Question ID is required"]
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;