import React from 'react'
import { marked } from 'marked'
import { Reply } from 'lucide-react'
import ReplyComment from './ReplyComponent'
const CommentComp = ({ comment ,questionId,setReload}) => {
    return (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-baseline justify-between text-sm text-gray-500 mb-2">
                <span className="font-medium">{comment.anonymousName}</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <div
                className="text-gray-800 leading-relaxed text-base"
                dangerouslySetInnerHTML={{
                    __html: marked.parse(comment.comment)
                }}
            />
            {((comment?.images?.length > 0) || (comment?.videos?.length > 0)) && (
                <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-rose-200 scrollbar-track-transparent mt-4 pb-2 snap-x snap-mandatory">

                  {comment?.images?.map((img, index) => (
                    <div
                      key={`img-${index}`}
                      className="snap-center flex-shrink-0 h-32 w-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <img
                        src={img.url}
                        alt={`Comment attachment ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {comment?.videos?.map((vid, index) => (
                    <div
                      key={`vid-${index}`}
                      className="snap-center flex-shrink-0 h-32 w-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center"
                    >
                      <video
                        src={vid.url}
                        controls
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
            )}
            <ReplyComment commentId={comment._id} questionId={questionId} setReload={setReload}/>
            <div className="border-l-2 border-gray-400 ml-4">
                {
                    comment?.childComments?.map((child) => (
                        <CommentComp key={child._id} comment={child} questionId={questionId} setReload={setReload}/>
                    ))
                }
            </div>
        </div>
    )

}

export default CommentComp