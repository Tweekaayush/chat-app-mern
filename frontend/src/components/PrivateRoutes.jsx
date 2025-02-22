import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { data:{_id} } = useSelector((state) => state.user);
  return _id ? <Outlet /> : <Navigate to="/login" replace/>;
};

export default PrivateRoutes;
