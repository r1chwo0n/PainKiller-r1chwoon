import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Notification from "./pages/notification.tsx";
import Homepage from "./homepage.tsx";
import UserHomepage from "./userHomepage.tsx";
import AddDrug from "./pages/addMedicineForm.tsx";
import EditDrug from "./pages/editMedicineDetail.tsx";
import DrugDetail from "./pages/detail.tsx";
import UserDrugDetail from "./pages/userDetail.tsx";

import "./input.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<UserHomepage />} />
        <Route path="/doctor" element={<Homepage />} />
        <Route path="/add-drug" element={<AddDrug />} />
        <Route path="/edit-drug/:id" element={<EditDrug />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/detail/:id" element={<DrugDetail />} />
        <Route path="/detail/user/:id" element={<UserDrugDetail />} />
      </Routes>
    </Router>
  </StrictMode>
);
