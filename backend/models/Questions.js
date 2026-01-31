import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media:{
        type: [String],
        required: false
    },
    author: {
        type: String,
        required: true
    },
    anonymousName: {
        type: String,
        default: "anonymous"
    }
},{timestamps:true})

const Question = mongoose.model.Question || mongoose.model("Question", QuestionSchema);

export default Question;