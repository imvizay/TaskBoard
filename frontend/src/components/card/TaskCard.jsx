import {MoreVertical,Calendar,GripVertical,Image as ImageIcon,} from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const priorityColor = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-orange-500",
  low: "bg-emerald-100 text-black",
};

function TaskCard({task,openMenuId,setOpenMenuId,dragListeners,dragAttributes,handleEditTask,handleDeleteTask,handleChangeStatus,handleTaskDetail}) {

  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="relative rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition hover:shadow-md">

    {/* Header */}
      <div className="flex items-start justify-between gap-3">
          <div className="flex flex-1 gap-3">
              <button
                  {...dragListeners}
                  {...dragAttributes}
                  className="mt-0.5 rounded p-1 text-gray-400 hover:bg-gray-100 active:cursor-grabbing"
              > <GripVertical size={17} /> </button>

              <div className="min-w-0 flex-1">

                  <h3 className="truncate wrap-anywhere w-[250px] text-[15px] font-semibold text-[var(--text-primary)]">
                      {task.task_name}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">

                      <span className="font-medium text-[var(--text-secondary)]">
                          {task.task_code}
                      </span>

                      <span
                          className={`rounded-md px-2 py-1 font-medium ${priorityColor[task.task_priority]}`}
                      >
                          {task.task_priority.toUpperCase()}
                      </span>

                      <div className="ml-auto flex items-center gap-1 text-[var(--text-secondary)]">
                          <Calendar size={13} />
                          <span>{task.due_date}</span>
                      </div>
                  </div>
              </div>
          </div>

          <button
              onClick={() =>
                  setOpenMenuId(openMenuId === task.id ? null : task.id)
              }
              className="rounded p-1.5 text-gray-400 hover:bg-gray-100">
              <MoreVertical size={17} />
          </button>
            
    </div>

    {openMenuId === task.id && (
        <MenuOption
            user={user}
            onClose = { () => setOpenMenuId(null)}
            handleEditTask={() => handleEditTask(task)}
            handleDelete = {()=>handleDeleteTask(task.id)}
            task={task}
            handleChangeStatus={handleChangeStatus}
            handleTaskDetail={handleTaskDetail}
        />
    )}

</div>
  );
}

export default TaskCard;



const MenuOption = ({user,handleEditTask,onClose,handleDelete,task,handleChangeStatus,handleTaskDetail}) => {


    return (
        <div className="absolute right-0 top-10 z-50 w-52 overflow-hidden rounded-xl border border-[var(--border)] bg-white py-1 shadow-lg">

            {user.is_admin ? (
                <>
                    <button
                        onClick={ () => {
                          console.log("Handle Edit task clicked")
                          handleEditTask()
                          onClose()
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                    >
                        Edit Task
                    </button>

                    <button
                        onClick={ () => handleTaskDetail(task)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                    >
                        View Details
                    </button>

                    <div className="my-1 border-t border-gray-200" />

                    <button
                        onClick={() => handleDelete()}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                        Delete Task
                    </button>
                </>
            ) : (
                <>  
                    <button  onClick={ () => handleTaskDetail(task)} className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100">
                        View Details
                    </button>

                    <div className="my-1 border-t border-gray-200" />

                    <button
                        onClick={() => handleChangeStatus(task.id,"pending")}
                        disabled={task.task_status == "pending"}
                        className={task.task_status == "pending" ?" bg-gray-100 text-gray-500 pointer-none w-full px-4 py-2.5 text-left text-sm" : "w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"}
                    >
                        Mark as Pending
                    </button>

                    <button
                        onClick={() => handleChangeStatus(task.id,"in-progress")}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                    >
                        Mark as In Progress
                    </button>

                    <button
                        onClick={() => handleChangeStatus(task.id,"completed")}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100"
                    >
                        Mark as Completed
                    </button>
                </>
            )}

        </div>
    );
};

