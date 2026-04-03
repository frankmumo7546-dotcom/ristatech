// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;