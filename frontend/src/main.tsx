import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './homepage.tsx'
// import AddDrug from './pages/test.tsx'
import "./input.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        {/* <Route path="/add-drug" element={<AddDrug />} /> */}
      </Routes>
    </Router>
  </StrictMode>,
)
