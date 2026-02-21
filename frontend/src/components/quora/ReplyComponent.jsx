import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import DescriptionWithMedia from './DescriptionWithMedia';
import { Reply,MessageCircle } from 'lucide-react'
import { toast } from 'react-toastify';
const ReplyComponent = ({ commentId, questionId,setReload }) => {
  const replyRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [reply,setReply] = useState(false);
  const handleSubmit = async () => {
    if (loading) return;
    const data = replyRef.current.fetchData();
    setLoading(true);
    if (!data.markdown && data.images.length === 0 && data.videos.length === 0) {
      toast.error("Please add some content");
      setLoading(0);
      return;
    }
    try {
      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("comment", data.markdown);
      formData.append("parentCommentId", commentId);
      // Append all images
      data.images.forEach((img) => formData.append("images", img));

      // Append all videos
      data.videos.forEach((vid) => formData.append("videos", vid));
      console.log(questionId);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/quora/${questionId}/comments/add`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(commentId ? "Reply added successfully" : "Comment added successfully");
      setReply(false);
      setReload(prev => !prev);
      replyRef.current.reset();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed Try again later ");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="">
        <button className="text-gray-500 hover:text-gray-700 text-sm mt-2 flex items-center gap-2"
        onClick={() => setReply(!reply)}
        >
           {commentId ? 
           <>
           <Reply /> Reply 
           </> 
           : 
           <h2 className="text-lg font-semibold flex items-center gap-2 text-black">
           <MessageCircle /> Comment
           </h2>}
        </button>
      </div>
      {reply && <DescriptionWithMedia ref={replyRef} />}
      {reply && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : commentId ? "Add Reply" : "Add Comment"}
          </button>
          <button
            onClick={() => setReply(false)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default ReplyComponent;