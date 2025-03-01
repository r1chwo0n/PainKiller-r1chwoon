import { Navigate } from "react-router-dom";
import { useAuth } from "./context";

const ProtectedRoute: React.FC<{ roleRequired: string; children: React.ReactNode }> = ({ roleRequired, children }) => {
  const { role } = useAuth();

  if (role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
