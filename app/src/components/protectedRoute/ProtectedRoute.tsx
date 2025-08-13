import React, { useLayoutEffect } from "react";
import { Navigate } from "react-router";
import { listProcess } from "../../apis/process";

function ProtectedRoutes({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (token) {
    return children;
  } else {
    return <Navigate to="/auth/login" />;
  }
}

export default ProtectedRoutes;
