import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AddMedicineForm from "./pages/AddMedicineForm";

import "./input.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AddMedicineForm />
  </StrictMode>
);
