import {X,Calendar,Flag,Type,Image,Loader2, Info,} from "lucide-react"
import { useState } from "react";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { http } from "../../settings/requests/requests";

const inputClass = "w-full rounded-md border border-[var(--border)] bg-[var(--bg-page)] px-3 py-2 text-sm outline-none focus:border-blue-500"

const labelClass ="mb-1 flex items-center gap-1 text-xs font-medium text-[var(--text-primary)]"

const EditTask = ({ onClose, task, loading}) => {

    const [updatedTask,setUpdatedTask] = useState({
        task_name:task.task_name || "",
        task_description:task.task_description || "",
        task_priority:task.task_priority || "medium",
        task_status:task.task_status || "pending",
        task_image:task.task_image || null,
        due_date:task.due_date || ""
    })
    const queryClient = useQueryClient()
    const taskUpdateMutation = useMutation({
        mutationKey:['update-task'],
        mutationFn:({formData,id})=>http.put(`tasks/${id}/`,updatedTask),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["tasks"]})
        }
    })

    const handleInput = (e) => {
        const{name,value,files} = e.target
        setUpdatedTask((prev)=>({
            ...prev,[name]:files ? files[0] : value
        }))
    }

    const updateSubmit = async (e) => {

        e.preventDefault()
        const formData = new FormData()

        Object.entries(updatedTask).forEach(
            ([Key,value]) => {
                if(value !== null) {
                    formData.append(Key,value)
                }
            }
        )

        try{
            const id = task.id
            const res = await taskUpdateMutation.mutateAsync({formData,id})
            console.log("task updated.")
            onClose()
        }catch(error){
            console.log("update failed.")
        }   
    }
    


  return (
    <div
      onClick={()=>{
        onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[90vh] w-full max-w-lg flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
          <h2 className="text-lg font-semibold">Edit Task</h2>

          <button onClick={()=> onClose()} className="rounded-md p-1 hover:bg-gray-100"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">

          <div>
            <label className={labelClass}><Type size={14} />Task Name</label>
            <input defaultValue={task?.task_name} onChange={handleInput} name="task_name" value={updatedTask.task_name} className={inputClass} />
          </div>


          <div><label className={labelClass}>Description</label>

            <textarea rows={3} onChange={handleInput} name="task_description" value={updatedTask.task_description} className={`${inputClass} resize-none`} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

             <div> 
                <label className={labelClass}> <Info size={14} /> Status </label>
                <select onChange={handleInput} name="task_status" value={updatedTask.task_status} className={inputClass}   >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div> 
                <label className={labelClass}> <Flag size={14} /> Priority </label>
                <select onChange={handleInput} name="task_priority" value={updatedTask.task_priority} className={inputClass}   >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <div>
              <label className={labelClass}><Calendar size={14} />Due Date</label>
              <input type="date" onChange={handleInput} name="due_date" value={updatedTask.due_date} className={inputClass} />
            </div>

          </div>

          <div>
            <label className={labelClass}> <Image size={14} /> Image </label>

            {task?.task_image ? (
              <img src={task?.task_image} alt="" className="mb-2 h-28 w-full rounded-md border object-cover" />
            ) : (
              <div className="mb-2 flex h-20 items-center justify-center rounded-md border border-dashed text-xs text-[var(--text-secondary)]">No image</div>
            )}

            <input onChange={handleInput} type="file" name="task_image" className="w-full text-xs"/>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[var(--border)] p-4">

          <button onClick={onClose} className="rounded-md border border-[var(--border)] px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>

          <button
            onClick={updateSubmit}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading && (
              <Loader2 size={15} className="animate-spin" />
            )}
            Update
          </button>

        </div>
      </div>
    </div>
  )
}

export default EditTask