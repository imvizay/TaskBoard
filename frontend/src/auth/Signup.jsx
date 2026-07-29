import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { http } from "../settings/requests/requests"
import { useNavigate } from "react-router-dom"

function SignupForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const signupMutation = useMutation({
        mutationFn: async () => {
            const { data } = await http.post("/signup/", { username, password })
            return data
        },

        onSuccess: (data) => {
            alert(data.message)
            setUsername("")
            setPassword("")
            navigate('/login')
        },

        onError: (error) => {
            alert(error.response?.data?.message || "Signup failed.")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!username || !password)
            return alert("Please fill all fields.")

        signupMutation.mutate()
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 max-w-md space-y-5 rounded-lg bg-white p-6 shadow"
        >
            <h2 className="text-center text-2xl font-bold">Create Account</h2>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border p-3"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border p-3"
            />

            <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full rounded bg-blue-600 py-3 text-white"
            >
                {signupMutation.isPending ? "Creating..." : "Create Account"}
            </button>
        </form>
    )
}

export default SignupForm