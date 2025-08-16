import { Navigate, Outlet } from "react-router";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "../atoms/auth.atom";

export const ProtectedRoute = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export const AuthRoute = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
