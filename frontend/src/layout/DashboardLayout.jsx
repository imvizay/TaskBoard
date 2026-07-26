
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import CreateTaskForm from "../components/form/CreateTaskForm"

function DashboardLayout() {
    
    const [publishTask,setPublishTask] = useState(false)
    const [user,setUser] = useState({})
  
    useEffect(()=>{
        const user  = JSON.parse(localStorage.getItem("taskboard_user"))
        if(!user){
            return
        }
        setUser(user)
    },[])

    useEffect(()=>{
        console.log("User",user)
    },[user])


  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Task Board</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage tasks across your team</p>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-light)] font-semibold text-[var(--brand)]">VM</div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)]">Vijay Meena</p>
              <p className="text-xs text-[var(--text-muted)]">Administrator</p>
            </div>

          </div>

        </div>

      </header>

      <section className="border-b border-[var(--border)] bg-[var(--bg-surface)]">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)] sm:max-w-sm"
            />
        
            {/* Status Filter */}
            <select
              className="rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)]"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
        
            {/* Priority Filter */}
            <select
              className="rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)]"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        
          {user.is_admin && (
            <button
            onClick={()=>setPublishTask(true)}
            className="rounded-[var(--radius-md)] bg-[var(--button-primary)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--button-primary-hover)]">
              Create Task
            </button>
          )}
        </div>

      </section>

     <main>
        
        {publishTask && (
            <CreateTaskForm onClose={() => setPublishTask(false)} />
        )}

        <Outlet/>
     </main>

    </div>
  )
}

export default DashboardLayout