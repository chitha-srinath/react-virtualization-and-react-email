import { useSearchParams, useNavigate, useLocation } from "react-router";
import { useSetAtom, useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { accessTokenAtom, isAuthenticatedAtom } from "../atoms/auth.atom";
import { ROUTES } from "../constants/routes";

const isLikelyValidToken = (t: string) =>
  /[^.]+\.[^.]+\.[^.]+/.test(t) || (t.length >= 8 && t.length <= 16384);

const extractHashToken = (hash: string) => {
  if (!hash) return null;
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(cleanHash);
  return params.get("access_token");
};

function Dashboard() {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const processedTokenRef = useRef<string | null>(null);

  const token =
    searchParams.get("token") ||
    searchParams.get("access_token") ||
    searchParams.get("bearer_token") ||
    searchParams.get("auth_token") ||
    extractHashToken(hash);

  useEffect(() => {
    if (!token) {
      navigate(isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
      return;
    }

    if (processedTokenRef.current === token) return; // already processed
    processedTokenRef.current = token;

    if (!isLikelyValidToken(token)) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    setAccessToken(token);
    setIsAuthenticated(true);
    navigate(ROUTES.HOME, { replace: true });
  }, [token, setAccessToken, setIsAuthenticated, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-600">Completing sign in...</div>
    </div>
  );
}

export default Dashboard;
