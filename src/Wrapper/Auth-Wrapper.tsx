import { Navigate, Outlet } from "react-router";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom, authInitializedAtom } from "../atoms/auth.atom";

export const ProtectedRoute = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const authInitialized = useAtomValue(authInitializedAtom);

  console.log("ProtectedRoute check:", { authInitialized, isAuthenticated });

  // Show loading while auth is initializing to prevent premature redirect
  if (!authInitialized) {
    console.log("ProtectedRoute: Waiting for auth initialization...");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Now we know auth has initialized, check if authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Auth initialized but not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("ProtectedRoute: Authenticated, rendering protected content");
  return <Outlet />;
};

export const AuthRoute = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  console.log("AuthRoute check:", { isAuthenticated });
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
