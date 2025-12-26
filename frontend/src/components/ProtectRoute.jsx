import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let role = "user";

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role) {
        role = user.role;
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // If not logged in, go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, go to home
  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // If admin, show the child route
  return <Outlet />;
};

export default ProtectRoute;
