import { Navigate } from "react-router";
import React from "react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const auth = true;

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Updated wrapper components for v7
// export function ProtectedRoute({ children }: { children: React.ReactNode }}) {
//   const auth = true;
//   return auth ? children : <Navigate to="/login" replace />;
// }

// function RedirectAuthenticatedUser() {
//   const auth = true;
//   if (auth) {
//     return <Navigate to="/home" replace />;
//   }
//   return <Outlet />;
// }
