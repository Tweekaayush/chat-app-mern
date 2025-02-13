import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { _id } = useSelector((state) => state.user.data);
  return _id ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
