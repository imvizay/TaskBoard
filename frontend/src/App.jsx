import React from 'react'
import './index.css'
import LandingPage from './pages/LandingPage'
import LoginPage from './auth/Login'

// Routing
import {Routes,Route} from 'react-router-dom'

function App() {
  return (
    <>
    {/* <div>
      <LandingPage/>
      <LoginPage/>
    </div> */}

    <Routes>
      <Route path='/'>
        <Route index element = {<LandingPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App