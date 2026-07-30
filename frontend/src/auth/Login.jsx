import { useState } from "react"
import { http } from "../settings/requests/requests"

// tanstack query
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from "react-router-dom"


export default function LoginPage() {

    const [loginCredential,setLoginCredential] = useState({
        username:'',
        password:''
    })

    const [loginError,setLoginError] = useState({})  
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationKey:['user-login'],
        mutationFn:(credential) => http.post("/login/",credential,{
            headers:{
                "Content-Type":"application/json"
            }
        }),
    })

    const credValidation = (loginCredential) => {
        const errors = {}
        if(!loginCredential.username.trim() || !loginCredential.password.trim()){
            errors['emptyField'] = "missing field"
        }

        else if (loginCredential.username.length < 4 ||loginCredential.username.length > 16) {
            errors.username = "Username must be between 4-16 characters.";
        }

        else if(loginCredential.password.length < 4 || loginCredential.password.length > 16){
            errors['password'] = 'Password must be between 4-16 characters.'
        }

        return {
            "validation":Object.keys(errors).length === 0,
            errors
        }
    }

    const handleInputChange = (e) => {
        const { name,value } = e.target
        setLoginCredential(
            prev => (
                {...prev,[name]:value}
            )
        )
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        const result = credValidation(loginCredential)

        if(!result.validation){
            setLoginError(result.errors)
            return
        }
        setLoginError({})
        try{
            const res = await loginMutation.mutateAsync(loginCredential)
            const user = res.data.user
            localStorage.setItem("taskboard_user",JSON.stringify({
                  username: user.username,
                  password: password,
                  is_admin:user.is_admin
              })
          )
            navigate('/task-dashboard')
        }

        catch(error){
            console.log("ERROR:",error)
        }
    }


  return (
    <section className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-md)]">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Login
          </h1>

          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Sign in to continue managing your tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="identifier"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Username or Email
            </label>

            <input
              id="identifier"
              onChange={handleInputChange}
              name="username"
              value={loginCredential.username || ""}
              type="text"
              placeholder="Enter your username or email"
              className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] outline-none transition focus:border-[var(--input-focus)]"
            />

            {loginError.username && <p className=" text-[12px] text-red-400">{loginError.username}</p>}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[var(--text-primary)]"
            >
              Password
            </label>

            <input
              id="password"
              onChange={handleInputChange}
              name="password"
              value={loginCredential.password || ""}
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--input-placeholder)] outline-none transition focus:border-[var(--input-focus)]"
            />

             {loginError.password && <p className=" text-[12px] text-red-400">{loginError.password}</p>}

          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full cursor-pointer rounded-[var(--radius-md)] bg-[var(--button-primary)] px-4 py-3 text-sm font-semibold text-[var(--text-inverse)] transition hover:bg-[var(--button-primary-hover)]"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  )
}