import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import AddComment from './AddComment';
import { marked } from 'marked';
const CommentComponent = ({ questionId, commentId }) => {
    const [comment, setComment] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/quora/${questionId}/comments/${commentId}`, {
                    withCredentials: true
                });
                console.log(response.data)
                setComment(response.data.comment);
            } catch (error) {
                if (error.response?.status === 401) {
                    toast.error("You are not authorized to access this page");
                    navigate(`/auth?from=${encodeURIComponent(location.pathname)}`);
                }
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchComment();
    }, [commentId, navigate, location.pathname]);
    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {comment && (
                <div>
                    <div className="max-w-none mb-10">
                        <div
                            className="text-gray-600 leading-relaxed prose prose-rose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: marked.parse(comment?.comment || '')
                            }}
                        />
                    </div>
                    <p>{comment.createdAt}</p>
                </div>
            )}
            <p>reply</p>
            <AddComment questionId={questionId} parentCommentId={commentId} />
            <div className='pl-4'>
                {
                    comment?.childCommentIds?.map((replyId) => (
                        <CommentComponent key={replyId} questionId={questionId} commentId={replyId} />
                    ))
                }
            </div>
        </div>
    )
}

export default CommentComponent