import { useInitializeAuth } from "../hooks";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoading, error } = useInitializeAuth();

  // Show loading screen while initializing auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  // If there's an error, still render children (auth state is cleared in the hook)
  if (error) {
    console.warn("Auth initialization failed:", error);
  }

  return <>{children}</>;
};
