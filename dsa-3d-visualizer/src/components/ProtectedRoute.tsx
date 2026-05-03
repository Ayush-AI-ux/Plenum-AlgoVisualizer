import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, show the page
  return <>{children}</>;
}