import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import Notification from "./pages/notification.tsx";
import Homepage from "./homepage.tsx";
import UserHomepage from "./userHomepage.tsx";
import AddDrug from "./pages/addMedicineForm.tsx";
import EditDrug from "./pages/editMedicineDetail.tsx";
import DrugDetail from "./pages/detail.tsx";
import UserDrugDetail from "./pages/userDetail.tsx";

import Login from "./pages/login.tsx";
import ProtectedRoute from "./auth/protect.tsx";
import { AuthProvider } from "./auth/context.tsx";
import "./input.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Navigate to="/patient" />} />
          <Route path="/patient" element={<UserHomepage />} />
          <Route path="/doctor/add-drug" element={<AddDrug />} />
          <Route path="/doctor/edit-drug/:id" element={<EditDrug />} />
          <Route path="/doctor/notification" element={<Notification />} />
          <Route path="/doctor/detail/:id" element={<DrugDetail />} />
          <Route path="/patient/detail/:id" element={<UserDrugDetail />} />

          <Route path="/login" element={<Login />} />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute roleRequired="doctor">
                <Homepage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>
);
