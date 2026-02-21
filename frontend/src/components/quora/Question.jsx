import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Clock, MessageCircle, Share } from 'lucide-react';
import { marked } from 'marked';
import Comments from './Comments';
import ReplyComponent from './ReplyComponent';
const Question = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/quora/${id}`, {
          withCredentials: true
        });
        setQuestion(response.data.question);
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
    fetchQuestion();
  }, [id, navigate, location.pathname, reload]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 rounded-full border-4 border-pink-200 border-t-[#E91E63] animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/40 border border-pink-100/50 overflow-hidden">

        {/* Header Section */}
        <div className="p-8 sm:p-10 pb-0">
          <div className="flex justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E91E63] to-pink-400 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg">
                  {question?.anonymousName || 'Anonymous User'}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {question?.createdAt
                      ? new Date(question.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      : 'Recently'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              title="Share"
            >
              <Share className="w-5 h-5 text-gray-500 hover:text-[#E91E63]" />
            </button>
          </div>

          {/* Question Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            {question?.question}
          </h1>
        </div>

        {/* Content Section */}
        <div className="px-8 sm:px-10 pb-10 ">
          {/* Description */}
          {question?.description && (
            <div className="max-w-none mb-10">
              <div
                className="text-gray-600 leading-relaxed prose prose-pink max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(question.description)
                }}
              />
            </div>
          )}

          <div className="mb-10">
            {((question?.images?.length > 0) || (question?.videos?.length > 0)) && (
              <div className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent px-2 snap-x snap-mandatory">

                {question?.images?.map((img, index) => (
                  <div
                    key={`img-${index}`}
                    className="snap-center flex-shrink-0 h-[420px] aspect-[4/5] rounded-2xl overflow-hidden bg-black"
                  >
                    <img
                      src={img.url}
                      alt={`Question attachment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

                {question?.videos?.map((vid, index) => (
                  <div
                    key={`vid-${index}`}
                    className="snap-center flex-shrink-0 h-[420px] aspect-video rounded-2xl overflow-hidden bg-black max-w-[420px] flex items-center justify-center"
                  >
                    <video
                      src={vid.url}
                      controls
                      className="h-full w-auto object-cover"
                    />
                  </div>
                ))}

              </div>
            )}
          </div>


        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/40 border border-pink-100/50 p-8 sm:p-10">
        <ReplyComponent questionId={id} commentId={null} setReload={setReload} />
      </div>
      {/* Comments Section */}
      <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/40 border border-pink-100/50 p-8 sm:p-10">
        <Comments questionId={id} />
      </div>
    </div>
  );
};

export default Question;