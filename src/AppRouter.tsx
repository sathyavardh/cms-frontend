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
  return (
    <Router>
      <Routes>
        {/* Auth is always public */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Home is protected */}
        <Route
          path="/home/:roleId?"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Default → redirect to home, ProtectedRoute will handle auth */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
