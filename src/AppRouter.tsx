import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "@/pages/Auth";
import HomePage from "@/pages/Home";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter: React.FC = () => {
  const token = localStorage.getItem("accessToken");

  return (
    <Router>
      <Routes>
        {/* Auth route */}
        <Route
          path="/auth"
          element={token ? <Navigate to="/home" replace /> : <AuthPage />}
        />

        {/* Home route with optional roleId */}
        <Route
          path="/home/:roleId?"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
