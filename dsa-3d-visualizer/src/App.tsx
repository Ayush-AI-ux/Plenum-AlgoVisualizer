import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/Resetpassword";
import Home from "./pages/Home";
import ProblemList from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";
import VisualizationPlayer from "./pages/VisualizationPlayer";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/problems" 
          element={
            <ProtectedRoute>
              <ProblemList />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/problems/:id" 
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/visualize/:id" 
          element={
            <ProtectedRoute>
              <VisualizationPlayer />
            </ProtectedRoute>
          } 
        />
         <Route path="/profile" element={<Profile />} />
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;