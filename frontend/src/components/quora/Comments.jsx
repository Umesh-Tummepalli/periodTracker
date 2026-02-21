import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import CommentComp from './CommentComp';
const Comments = ({questionId}) => {
  const [comments,setComments] = useState([]);
  const [loading,setLoading] = useState(true);
  const [reload,setReload] = useState(false);
  const [error,setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/quora/${questionId}/comments/`,{
          withCredentials: true
        });
        setComments(response.data.comments);
        console.log(response.data.comments);
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
  }, [questionId,reload]);
  return (
    <div>Comments:
      {
        comments.map((comment) => (
          <CommentComp key={comment._id} comment={comment} questionId={questionId} setReload={setReload} />
        ))
      }
    </div>
  )
}

export default Comments