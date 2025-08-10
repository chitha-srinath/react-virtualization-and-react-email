import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../atoms/auth.atom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If used as a layout route, render Outlet; otherwise render children
  return children ? <>{children}</> : <Outlet />;
};

export const RedirectAuthenticatedUser: React.FC = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
