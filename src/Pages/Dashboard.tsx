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

  // Use the new useVerifyToken hook for API-based verification
  const { data: tokenVerification, isLoading } = useVerifyToken(token);

  useEffect(() => {
    if (!token) {
      navigate(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
      return;
    }

    // Wait for API verification result
    if (tokenVerification !== undefined) {
      if (tokenVerification?.success) {
        // Token verified by API, atoms already updated in the hook
        navigate(ROUTES.HOME, { replace: true });
      } else {
        // API verification failed
        console.error(
          "Token verification failed:",
          tokenVerification?.message || "Unknown error"
        );
        navigate(ROUTES.LOGIN, { replace: true });
      }
    }
  }, [token, tokenVerification, navigate, isAuthenticated]);

  return (
    isLoading && (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Completing sign in...</div>
      </div>
    )
  );
}

export default Dashboard;
