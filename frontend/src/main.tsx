import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Notification from "./pages/notification.tsx";
import Homepage from "./Homepage.tsx";
// import AddDrug from './pages/test.tsx'
import "./input.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/add-drug" element={<AddDrug />} /> */}
        <Route path="/notification" element={<Notification/>} />
      </Routes>
    </Router>
  </StrictMode>
);
