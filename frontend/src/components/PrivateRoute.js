import React from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
};

export default PrivateRoute;
