import React, { useRef, useState } from 'react'
import DescriptionWithMedia from './DescriptionWithMedia';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';
const AddComment = ({ questionId, parentCommentId = null }) => {
    const descRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // 1. Get Data from Child
        if (loading) return;
        const data = descRef.current.fetchData();
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

            // Append all images
            data.images.forEach((img) => formData.append("images", img));

            // Append all videos
            data.videos.forEach((vid) => formData.append("videos", vid));

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
            toast.success("Comment added successfully");
            descRef.current.reset();

        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Upload failed Try again later ");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <DescriptionWithMedia ref={descRef} initialMarkdown="" />
            <button onClick={handleSubmit} className={`cursor-pointer m-3 bg-[#E91E63] text-white px-4 py-2 rounded-xl hover:bg-[#C2185B] transition-colors ${loading ? "opacity-50 cursor-not-allowed " : ""}`}>{loading ? <Loader className="animate-spin" /> : "Add"}</button>
        </>
    )
}

export default AddComment