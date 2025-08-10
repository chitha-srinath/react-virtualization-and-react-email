// hooks/useAuth.ts
import { useAtom } from "jotai";
import {
  accessTokenAtom,
  userAtom,
  isAuthenticatedAtom,
} from "../atoms/auth.atom";
import { useLogin, useLogout } from "./useAuthQueries";

export const useAuth = () => {
  const [accessToken] = useAtom(accessTokenAtom);
  const [user] = useAtom(userAtom);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const login = (email: string, password: string) => {
    return loginMutation.mutate({ email, password });
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    login,
    logout,
    accessToken,
    user,
    isAuthenticated,
    // Expose mutation states for UI feedback
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};
