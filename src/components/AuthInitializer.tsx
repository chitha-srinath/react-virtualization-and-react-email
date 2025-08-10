import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { authInitializedAtom } from "../atoms/auth.atom";
import { useInitializeAuth } from "../hooks/useAuthQueries";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const authInitialized = useAtomValue(authInitializedAtom);
  const initializeAuth = useInitializeAuth();

  useEffect(() => {
    if (!authInitialized) {
      initializeAuth.mutate();
    }
  }, [authInitialized, initializeAuth]);

  // Show loading screen while initializing auth
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
