import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SellerRoute = () => {
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
      // ignore
    }
  }

  // If not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If not seller or admin
  if (role !== "seller" && role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default SellerRoute;
