import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Homepage.tsx";
import "./input.css";
import Detail from "./detail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/drugs/search" element={<Detail />} />
      </Routes>
    </Router>
  </StrictMode>
);
