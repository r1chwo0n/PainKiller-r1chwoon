import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './Homepage.tsx'
import "./input.css"
import Detail from './detail.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Homepage /> */}
     <Detail/>
  </StrictMode>,
)
