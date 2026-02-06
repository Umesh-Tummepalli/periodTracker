import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios';
import AddComment from './AddComment';
import CommentComponent from './CommentComponent';
const Comments = ({questionId}) => {
  const [commentIds,setCommentIds] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/quora/${questionId}/comments/`,{
          withCredentials: true
        });
        setCommentIds(response.data.commentIds);
        console.log(response.data.commentIds);
      } catch (error) {
        if(error.response?.status === 401){
          toast.error("You are not authorized to access this page");
          navigate(`/auth?from=${encodeURIComponent(location.pathname)}`);
        }
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [questionId]);
    
    
   
  return (
    <>
        <AddComment questionId={questionId} />
        <div>
            {commentIds.map((commentId) => (
                <CommentComponent key={commentId} questionId={questionId} commentId={commentId} parentCommentId={null} />
            ))}
        </div>
    </>
  )
}

export default Comments