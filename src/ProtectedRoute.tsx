import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  const expiresAt = localStorage.getItem("expiresAt");
  const now = Date.now();
  const expiry = expiresAt ? new Date(expiresAt).getTime() : 0;

  if (!token || !expiresAt || now >= expiry) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
