import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {BrowserRouter} from 'react-router-dom'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from './contexts/UserContext.jsx'

const client = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    
  <BrowserRouter>
    <UserProvider>
       <App />
    </UserProvider>
  </BrowserRouter>
  
  </QueryClientProvider>,
)
