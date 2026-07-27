import React from 'react'
import './index.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './auth/Login'

// Routing
import {Routes,Route} from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedDashboardRoute from './protected_route/ProtectedDashboardRoute'
import TaskBoard from './pages/dashboard_pages/TaskBoard'

function App() {
  return (
    <>
  
    <Routes>
      <Route path='/'>
        <Route index element = {<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Route>

      <Route 
        path='/task-dashboard' 
        element={
        <ProtectedDashboardRoute> 
          <DashboardLayout/> 
        </ProtectedDashboardRoute>}>

        <Route index element = {<TaskBoard/>} />

        

      </Route>

    </Routes>
    </>
  )
}

export default App