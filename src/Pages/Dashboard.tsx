import { useSearchParams, useNavigate } from "react-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { isAuthenticatedAtom } from "../atoms/auth.atom";
import { ROUTES } from "../constants/routes";
import { useVerifyToken } from "../hooks";

function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const token = searchParams.get("token");

  // Verify token if present, otherwise just check auth state
  const { data: tokenVerification, isLoading } = useVerifyToken(token);

  useEffect(() => {
    // No token in URL - redirect based on current auth state
    if (!token) {
      navigate(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
      return;
    }

    // Token verification completed
    if (tokenVerification !== undefined) {
      if (tokenVerification?.error) {
        // Token verification failed
        console.warn("Token verification failed:", tokenVerification.message);
        navigate(ROUTES.LOGIN, { replace: true });
      } else {
        // Token verified successfully - redirect to home
        navigate(ROUTES.HOME, { replace: true });
      }
    }
  }, [token, tokenVerification, isAuthenticated, navigate]);

  // Loading state
  return (
    isLoading && (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Completing sign in...</div>
      </div>
    )
  );
}

export default Dashboard;
