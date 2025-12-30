import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const token = localStorage.getItem("token");

  // If not logged in, go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the child route
  return <Outlet />;
};

export default AuthRoute;
