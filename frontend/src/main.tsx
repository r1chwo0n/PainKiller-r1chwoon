import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Notification from "./pages/notification.tsx";
import Homepage from "./homepage.tsx";
import AddDrug from './pages/addMedicineForm.tsx'
import EditDrug from './pages/editMedicineDetail.tsx'
import DrugDetail from "./pages/detail.tsx"

import "./input.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-drug" element={<AddDrug />} />
        <Route path="/edit-drug/:id" element={<EditDrug />} />
        <Route path="/notification" element={<Notification/>} />
        <Route path="/detail/:id" element={<DrugDetail />} />
      </Routes>
    </Router>
  </StrictMode>

);
