import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './Homepage.tsx'
import Notification from './pages/notification.tsx'
import "./input.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Homepage /> */}
    <Notification/>
  </StrictMode>
)
