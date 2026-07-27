import React,{useState,useEffect} from "react";
import TaskCard from "../../components/card/TaskCard"
import { useOutletContext } from "react-router-dom";

// drag and drop
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import SortableTaskCard from "../../components/card/SortableTaskCard";

function TaskBoard() {
   
    const tasks = useOutletContext().data || []

    const [openMenuId,setOpenMenuId] = useState(null)
    
    const [pendingTasks, setPendingTasks] = useState([]);
    const [inProgressTasks, setInProgressTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);


    useEffect(() => {
        setPendingTasks(
            tasks
                .filter(task => task.task_status === "pending")
                .sort((a, b) => a.position - b.position)
        )
        setInProgressTasks(
            tasks
                .filter(task => task.task_status === "in-progress")
                .sort((a, b) => a.position - b.position)
        )
        setCompletedTasks(
            tasks
                .filter(task => task.task_status === "completed")
                .sort((a, b) => a.position - b.position)
        )
    }, [tasks])
    


  return (
    <section className="min-h-screen bg-[var(--bg-page)] p-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Pending */}
        <div className="rounded-xl bg-[var(--bg-surface)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              To Do
            </h2>

            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {pendingTasks.length || 0}
            </span>
          </div>

         <DndContext>

            <SortableContext items={pendingTasks.map(task=>task.id)}>
                <div className="space-y-4">
                  {pendingTasks.length > 0 ? pendingTasks.map((task)=>(
                      <SortableTaskCard
                          key={task.id}
                          task={task}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                      />
                  )): 

                  (<div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-page)] text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      No pending tasks
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      Tasks waiting to be started will appear here.
                    </p>
                  </div>)}
                </div>
            </SortableContext>

         </DndContext>

        </div>

        {/* In Progress */}
        <div className="rounded-xl bg-[var(--bg-surface)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              In Progress
            </h2>

            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
              {inProgressTasks.length || 0}
            </span>
          </div>
            
            {/* IN PROGRESS */}
            <div className="space-y-4">
            {inProgressTasks.length > 0 ? inProgressTasks.map((task)=>(
                <TaskCard 
                key={task.id} 
                task={task} 
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                />
            )): 

            (<div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-page)] text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No pending tasks
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Tasks waiting to be started will appear here.
              </p>
            </div>)}
            
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-[var(--bg-surface)] p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Completed
            </h2>

            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
              {completedTasks.length || 0}
            </span>
          </div>

            <div className="space-y-4">
            {completedTasks.length > 0 ? completedTasks.map((task)=>(
                <TaskCard
                    key={task.id}
                    task={task}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                />
            )): 

            (<div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-page)] text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No completed tasks yet
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Completed task will appear here.
              </p>
            </div>)}
            
          </div>
        </div>
      </div>
    </section>
  );
}

export default TaskBoard;