import React,{useState,useEffect,useRef, useMemo, useCallback} from "react"
import TaskCard from "../../components/card/TaskCard"
import { useOutletContext } from "react-router-dom"

import { useQuery,useQueryClient } from "@tanstack/react-query"

// DRAG N DROP.
import { DndContext,closestCenter } from '@dnd-kit/core'
import { SortableContext,verticalListSortingStrategy,arrayMove } from '@dnd-kit/sortable'
import SortableTaskCard from "../../components/card/SortableTaskCard"

// MUTATION FN.
import { useMutation } from "@tanstack/react-query"
import { http } from "../../settings/requests/requests"
import EditTask from "../../components/form/EditTask"

function TaskBoard() {
  
    const [openMenuId,setOpenMenuId] = useState(null)
    const [selectedTask,setSelectedTask] = useState(null)
    const [openEditTask,setOpenEditTask] = useState(false)
    
    const [pendingTasks, setPendingTasks] = useState([])
    const [inProgressTasks, setInProgressTasks] = useState([])
    const [completedTasks, setCompletedTasks] = useState([])

    const saveTimeout = useRef(null)
    const tasks = useOutletContext() ?? []

    const queryClient = useQueryClient()

    useEffect(() => {
      console.log("tasks changes everytime")
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

    const deleteMutation = useMutation({
      mutationKey:['delete-task'],
      mutationFn:(id)=>http.delete(`tasks/${id}/`),
      onSuccess:()=>{
        queryClient.invalidateQueries({
          queryKey:['tasks']
        })
      }
    })

    // Edit task
    const handleEditTask = (task) => {
      console.log("Handle Edit Task Working",task)
      setSelectedTask(task)
      setOpenEditTask(true)
    }

    // Delete task
    const handleDeleteTask = (id) => {
      deleteMutation.mutate(id)
      setOpenMenuId(false)
    }

    const reorderedMutation = useMutation({
        mutationKey:["reorder-mutation"],
        mutationFn:(positions)=>http.patch('/tasks/reorder/',positions)
    })


    const handleDragEnd = (event) => {

        const { active, over } = event

        if (!over) return

        if (active.id === over.id) return

        setPendingTasks((tasks) => {

            const oldIndex = tasks.findIndex(
                task => task.id === active.id
            )

            const newIndex = tasks.findIndex(
                task => task.id === over.id
            )

            const reordered = arrayMove(tasks, oldIndex, newIndex)

            clearTimeout(saveTimeout.current)

            saveTimeout.current = setTimeout(() => {
                const positions = reordered.map((task,index)=>({
                    id:task.id,
                    position:index + 1
                }))

                reorderedMutation.mutate(positions)

            }, 2000);

            return reordered
        })
    }
    

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

         <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

            <SortableContext 
                items={pendingTasks.map(task=>task.id)} 
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-4">
                  {pendingTasks.length > 0 ? pendingTasks.map((task)=>(
                      <SortableTaskCard
                          key={task.id}
                          task={task}
                          openMenuId={openMenuId}
                          setOpenMenuId={setOpenMenuId}
                          handleEditTask={handleEditTask}
                          handleDeleteTask = {handleDeleteTask}
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
      {openEditTask && (
        <EditTask 
        task={selectedTask}
        onClose={()=>setOpenEditTask(false)}
        />
      )}
    </section>
  )
}

export default TaskBoard


