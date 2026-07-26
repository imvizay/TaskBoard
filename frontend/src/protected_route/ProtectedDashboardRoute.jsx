import React from 'react'
import { Navigate, replace } from 'react-router-dom'

function ProtectedDashboardRoute({children}) {

    const user = JSON.parse(localStorage.getItem('taskboard_user'))

    if(!user){
        alert("Unnonymous access not allowed")
        return <Navigate to='/login' replace />
    }

    return children
}

export default ProtectedDashboardRoute