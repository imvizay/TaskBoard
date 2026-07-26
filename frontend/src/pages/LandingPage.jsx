import { useNavigate } from "react-router-dom"

function LandingPage() {

  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          Task Board
        </h1>

        <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
          Organize your work, manage priorities, and keep every task moving
          forward with a simple and efficient workspace built for productivity.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button 
          onClick={ () => navigate('/login') } 
          className="w-full rounded-lg bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-800 sm:w-auto">
            Login
          </button>

          <button className="w-full rounded-lg border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto">
            Sign Up
          </button>
        </div>
      </div>
    </section>
  )
}

export default LandingPage