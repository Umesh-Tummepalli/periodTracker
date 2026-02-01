import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true },
);

const Question = mongoose.model("Question", QuestionSchema);

export default Question;
