import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import EditMedicineDetail from "./pages/EditMedicineDetail";

import "./input.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EditMedicineDetail />
  </StrictMode>
);
