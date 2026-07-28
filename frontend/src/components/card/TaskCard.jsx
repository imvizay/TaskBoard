import React,{useState} from "react";
import { MoreVertical, Calendar } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

const priorityColor = {
    high: "text-red-600",
    medium: "text-amber-600",
    low: "text-emerald-600",
  }

function TaskCard({task,openMenuId,setOpenMenuId}) {

    const {user} = useUser()
  
  

  return (
   
    <div className="relative rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {task?.task_name}
          </h3>

          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
            {task?.task_code}
          </p>
        </div>

        <button
          onPointerDown={(e) => e.stopPropagation()} 
          onClick={ () => setOpenMenuId(openMenuId == task.id ? null : task.id)} className="rounded p-1 text-[var(--text-secondary)] hover:bg-gray-100">
          <MoreVertical size={16} />
        </button>
        {openMenuId == task.id && <MenuOption user={user}/>}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
          <Calendar size={14} />
          <span>{task?.due_date}</span>
        </div>

        <span className={`font-medium ${priorityColor[task?.task_priority]}`}>
          {task?.task_priority?.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;


const MenuOption = ({user}) => {
    
    return(
        <div className="absolute right-3 top-10 z-20 w-48 rounded-lg border border-[var(--border)] bg-white shadow-lg">

        {user.is_admin ? (
          <>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Edit Task</button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Change Priority</button>
            <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">Delete Task</button>
          </>
        ) : (
          <>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Mark In Progress</button>
            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Mark Completed</button>
          </>
        )}
        </div>
    )      
}   