import React, { useRef, useState } from "react";
import DescriptionWithMedia from "./DescriptionWithMedia";
import { toast } from "react-toastify";
import { Send , Loader2} from "lucide-react";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const NewQuestion = () => {
  const descRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    // 1. Get Data from Child
    const data = descRef.current.fetchData();
    if(!question){
      toast.error("Please enter your question.");
      return;
    }
    setLoading(true);
    console.log("Submitting:", data);

    try {
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("question", question);
      formData.append("description", data.markdown);

      // Append all images
      data.images.forEach((img) => formData.append("images", img));
      
      // Append all videos
      data.videos.forEach((vid) => formData.append("videos", vid));

      try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/quora/`, formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if(response.data.success){
            toast.success("Question posted successfully");
            navigate(`/quora/${response.data.questionId}`);  
        }
        else{
            toast.error("Upload failed Try again later ");
        }
      }catch(error){
        console.error("Upload failed", error);
        toast.error("Upload failed Try again later "+error.response.data.message);
      }
      
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed Try again later ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/30 px-4 py-10">
         {/* Submit Action */}
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              flex items-center rounded-xl px-8 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 transition-all
              ${loading 
                ? "cursor-not-allowed bg-rose-300" 
                : "bg-gradient-to-r from-rose-500 to-rose-600 hover:scale-105 hover:shadow-rose-500/40 active:scale-95"
              }
            `}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send />}
          </button>
        </div>
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Ask a Question</h1>
          <p className="text-gray-500">Describe your issue and upload relevant screenshots or screen recordings.</p>
        </div>

        {/* Question Title Input */}
        <div className="rounded-2xl border border-rose-100 bg-white p-2 shadow-lg shadow-rose-200/20 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
          <input
            type="text"
            placeholder="What's your question?"
            className="w-full rounded-xl bg-transparent px-4 py-3 text-xl font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        {/* Rich Description Component */}
        <DescriptionWithMedia ref={descRef} initialMarkdown="Explain your problem in detail"/>
      </div>
    </div>
  );
};

export default NewQuestion;