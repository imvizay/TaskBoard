import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
export const UserContext = createContext()

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("taskboard_user"))
        console.log("STORED PARSED USER:",storedUser)
        if (!storedUser) return
        setUser(storedUser)
    }, [])

    const logout = () => {
        localStorage.removeItem("taskboard_user");
        setUser(null)
        navigate('/login')
    }

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    )

} 

export const useUser = () => useContext(UserContext)