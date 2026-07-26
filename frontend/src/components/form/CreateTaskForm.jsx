import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { http } from "../../settings/requests/requests"

function CreateTaskForm({ onClose }) {

  const [task, setTask] = useState({
    task_name: "",
    task_priority: "medium",
    task_status: "pending",
    task_description: "",
    due_date: "",
    task_image: null,
  })



  const [taskError,setTaskError] = useState({})

  const taskMutation = useMutation({
    mutationKey:['create-task'],
    mutationFn:(task)=>http.post('tasks/',task,{
        headers:{
            "Content-Type":'multipart/form-data'
        }
    })
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target

    setTask((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }))
  }

  const taskValidation = (task) => {
    const error = {}
    const {task_name,due_date,task_image} = task

    if(!task_name.trim()){
        error.task_name = "Task name cannot be empty"
    }

    if(!due_date.trim()){
        error.due_date = "Task Due Date cannot be empty"
    }

    else{
        const today = new Date();
        console.log("today date:",today)

        today.setHours(0,0,0,0)

        const selectedDate = new Date(due_date);

        if(selectedDate < today){
            error.due_date = "dueDate cannot be a past day."
        }
    }

    // images

    if(task_image){
        const MAX_SIZE = 5*1024*1024

        if(task_image.size > MAX_SIZE){
            error.task_image = "image cannot be larger than 05 MB."
        }
    }
    return {
        'isValid':Object.keys(error).length === 0,
        error
    }

  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const validatedData = taskValidation(task)

    if(!validatedData.isValid){
        setTaskError(validatedData.error)
        return 
    }

    setTaskError({})

    const formData = new FormData()

    console.log(task.task_image);
    console.log(task.task_image instanceof File);

    Object.entries(task).forEach(([key,value]) => {
        if(key=="task_image" && value == null){
            return
        }
        formData.append(key,value)
    })

    try{
        const result = await taskMutation.mutateAsync(formData)
        console.log("RESULT RESPONSE",result.data)
    }
    catch(error){
        console.log("ERROR:",error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Fill in the task information below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition hover:bg-[var(--bg-page)]"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="flex flex-1 flex-col overflow-hidden"
        >
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Task Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Task Name
                </label>

                <input
                  type="text"
                  name="task_name"
                  value={task.task_name}
                  onChange={handleChange}
                  placeholder="Task name"
                  className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 outline-none transition focus:border-[var(--border-focus)]"
                />
                {taskError.task_name && <p className="text-[12px] text-red-400">{taskError.task_name}</p>}
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Priority
                </label>

                <select
                  name="task_priority"
                  value={task.task_priority}
                  onChange={handleChange}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 outline-none transition focus:border-[var(--border-focus)]"
                >
                  <option value={"low"}>Low</option>
                  <option value={"medium"}>Medium</option>
                  <option value={"high"}>High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Status
                </label>

                <select
                  name="task_status"
                  value={task.task_status}
                  onChange={handleChange}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 outline-none transition focus:border-[var(--border-focus)]"
                >
                  <option value={"pending"}>Pending</option>
                  <option value={"in-progress"}>In Progress</option>
                  <option value={"completed"}>Completed</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Due Date
                </label>

                <input
                  type="date"
                  name="due_date"
                  value={task.due_date}
                  onChange={handleChange}
                  className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 outline-none transition focus:border-[var(--border-focus)]"
                />
                {taskError.due_date && <p className="text-[12px] text-red-400">{taskError.due_date}</p>}

              </div>

              {/* Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Task Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  name="task_image"
                  onChange={handleChange}
                  className="w-full rounded-[var(--radius-md)] border border-dashed border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm"
                />
                {taskError.task_image && <p className="text-[12px] text-red-400">{taskError.task_image}</p>}

              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
                  Description
                </label>

                <textarea
                  rows={6}
                  name="description"
                  value={task.task_description}
                  onChange={handleChange}
                  placeholder="Write a short description..."
                  className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 outline-none transition focus:border-[var(--border-focus)]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-[var(--border)] bg-[var(--bg-surface)] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-md)] border border-[var(--border)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--bg-page)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-[var(--radius-md)] bg-[var(--button-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--button-primary-hover)]"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskForm