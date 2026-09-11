import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Send the user to log in, remembering where they were headed
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
