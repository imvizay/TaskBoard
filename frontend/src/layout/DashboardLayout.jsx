
import { useEffect, useMemo, useState } from "react"
import { Outlet } from "react-router-dom"
import CreateTaskForm from "../components/form/CreateTaskForm"
import { ChevronDown, Download, FileText, Rows3 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { http } from "../settings/requests/requests"


function DashboardLayout() {
    
    const [publishTask,setPublishTask] = useState(false)
    const [user,setUser] = useState({})
    const [openExport, setOpenExport] = useState(false)

    const [searchQuery,setSearchQuery] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
  
    useEffect(()=>{
        const user  = JSON.parse(localStorage.getItem("taskboard_user"))
        if(!user){
            return
        }
        setUser(user)
    },[])


    // Get All tasks.
    const {data:tasks = []} = useQuery({
        queryKey:['tasks'],
        queryFn: async () => {
          console.log("fetching tasks...")
          const res = await http.get('tasks/')
          return res.data
        },
        retry: false,
    })

    // SEARCH & FILTERS
    const tasksToDisplay = useMemo(() => {

        // Search 
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
        
            return tasks.filter(task =>
                task.task_name.toLowerCase().includes(query) ||
                task.task_code.toLowerCase().includes(query)
            );
        }
      
        // Priority filter
        if (priorityFilter !== "") {
            return tasks.filter(
                task => task.task_priority === priorityFilter
            );
        }
      
        // Status filter
        if (statusFilter !== "") {
            return tasks.filter(
                task => task.task_status === statusFilter
            );
        }
      
        return tasks;
      
    }, [tasks, searchQuery, priorityFilter, statusFilter]);
    




    // DOWNLOADS
    const handleDownloadPDF = async () => {
        const response = await http.get("/tasks/export/pdf/",{
          responseType:"blob"
        })
        const url = URL.createObjectURL(response.data)

        const a = document.createElement('a')
        a.href = url
        a.download = 'tasks.pdf'
        a.click()
        URL.revokeObjectURL(url)
    }

    // HANDLE DOWNLAOD EXCEL
    const handleDownloadExcel = async () => {
        const response = await http.get("/tasks/export/excel/",
            {
                responseType: "blob",
            }
        )
      
        const url = window.URL.createObjectURL(response.data)
        const a = document.createElement("a")
      
        a.href = url
        a.download = "tasks.xlsx"
        a.click()
      
        window.URL.revokeObjectURL(url)
    }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">

      <header className="border-b border-[var(--border)] bg-[var(--bg-surface)]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Task Board</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage tasks across your team</p>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-light)] font-semibold text-[var(--brand)]">V</div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)]">{user?.username?.toUpperCase()}</p>
              <p className="text-xs text-[var(--text-muted)]">{user.is_admin ? "Adminstrator":"User"}</p>
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
              value={searchQuery}
              onChange={ (e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)] sm:max-w-sm"
            />
        
            {/* Status Filter */}
            <select
            value={statusFilter}
            onChange={(e) => {
                setStatusFilter(e.target.value);
                setPriorityFilter("");
            }}
            
              className="rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)]"
            >
              <option value="">All Status</option>
              <option value="pending">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
        
            {/* Priority Filter */}
            <select
            value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setStatusFilter("");
              }}
              className="rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--border-focus)]"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        
         {user.is_admin && (
           <div className="flex items-center gap-2">
           
             <div className="relative">
                 
               <button
                 onClick={() => setOpenExport((prev) => !prev)}
                 className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm hover:bg-gray-50"
               >
                 <Download size={16} />
                 Export
                 <ChevronDown
                   size={15}
                   className={`transition-transform ${
                     openExport ? "rotate-180" : ""
                   }`}
                 />
               </button>
                 
               {openExport && (
                 <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-[var(--border)] bg-white shadow-lg">
                 
                   <button
                     onClick={handleDownloadPDF}
                     className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100"
                   >
                     <FileText/> Download as PDF
                   </button>
               
                   <button
                     onClick={handleDownloadExcel}
                     className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-gray-100"
                   >
                     <Rows3/> Download as Excel
                   </button>
               
                 </div>
               )}
             </div>

                <button
                  onClick={() => setPublishTask(true)}
                  className="rounded-md bg-[var(--button-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--button-primary-hover)]"
                >
                  Create Task
                </button>

              </div>
            )}
        </div>

      </section>

     <main>

        {publishTask && (
            <CreateTaskForm onClose={() => setPublishTask(false)} />
        )}

        <Outlet context={tasksToDisplay}/>
     </main>

    </div>
  )
}

export default DashboardLayout