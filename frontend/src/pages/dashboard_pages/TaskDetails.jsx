import { X, Paperclip, Send } from "lucide-react"
import { useState } from "react"

function TaskDetail({ task, onClose,handleComments }) {

  const [comment,setComment] = useState("")

  const currentUser = JSON.parse(localStorage.getItem("taskboard_user"))
  
  const comments = task?.comments || []

  const attachments = task?.attachments || []

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute right-6 top-1/2 flex h-[88vh] w-full max-w-md -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b p-2">
          <div className="mb-4 flex items-start justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-1xl font-semibold text-gray-900">
                {task.task_name}
              </h2>

              <p className="mt-1 text-[12px] font-medium tracking-widest text-gray-400">
                {task.task_code}
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-[14px] leading-6 text-gray-600">
            {task.task_description || "No description provided."}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-medium capitalize text-blue-700">
              Status : {task.task_status.toUpperCase()}
            </span>

            <span className="rounded-full px-3 py-1 text-xs font-medium capitalize text-red-700">
              Priority : {task.task_priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Attachments */}
        <div className="border-b p-2">
          <div className="mb-2 flex items-center gap-2">
            <Paperclip size={15} />
            <h3 className="text-sm font-semibold">Attachments</h3>
          </div>

          {task.task_image ? (
            <div className="flex gap-3 overflow-x-auto pb-1">
                <img
                
                  src={task.task_image}
                  alt=""
                  className="h-10 w-10 rounded-lg border object-cover"
                />
              
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-sm text-gray-400">
              No attachments
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b px-5 py-1">
            <h3 className="font-semibold">
              Comments ({comments.length})
            </h3>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto bg-gray-50 p-5">

            {comments.length ? (
              comments.map((comment) => {
                const mine = comment.user_id === currentUser.id

                return (
                  <div
                    key={comment.user_id}
                    className={`flex ${
                      mine ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-1 shadow-sm ${
                        mine ? "bg-blue-600 text-white" : "bg-white"
                      }`}
                    >
                      {!mine && (
                        <p className="mb-1 text-[12px] font-semibold text-gray-500">
                          {comment.username}
                        </p>
                      )}

                      <p className="text-sm">
                        {comment.comment}
                      </p>

                      <p
                        className={`mt-2 text-[10px] ${
                          mine
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {comment.created_at}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No comments yet.
              </div>
            )}

          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white p-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <button onClick={()=>handleComments(task.id,comment)} className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700">
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TaskDetail