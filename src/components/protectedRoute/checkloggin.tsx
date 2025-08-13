import React from "react";
import { Navigate } from "react-router";

export default function CheckLogin(WrappedComponent: React.ComponentType) {
  return function (props: any) {
    const token = localStorage.getItem("token");
    if (token) {
      return <Navigate to="/process-list-v2" replace />;
    }
    return <WrappedComponent {...props} />;
  };
}
