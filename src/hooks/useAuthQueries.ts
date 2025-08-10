// hooks/useAuthQueries.ts
import { useAtom, useSetAtom } from "jotai";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  accessTokenAtom,
  userAtom,
  isAuthenticatedAtom,
} from "../atoms/auth.atom";
import { api } from "../services/api";

// Custom hook for fetching user data
export const useUser = () => {
  const [accessToken] = useAtom(accessTokenAtom);

  return useQuery({
    queryKey: ["user", accessToken],
    queryFn: async () => {
      if (!accessToken) return null;
      const res = await api.get("/auth/me");
      return res.data;
    },
    enabled: !!accessToken, // Only run query when we have an access token
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook for login mutation
export const useLogin = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Login failed:", error);
      // Handle login error (you might want to show a toast or error message)
    },
  });
};

// Hook for register mutation
export const useRegister = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      confirmPassword,
    }: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      // Invalidate and refetch any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      // Handle registration error (you might want to show a toast or error message)
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint if you have one
      try {
        await api.post("/auth/logout");
      } catch (error) {
        // Even if logout API fails, we still want to clear local state
        console.warn("Logout API call failed:", error);
      }
    },
    onSuccess: () => {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      // Clear all queries from cache
      queryClient.clear();
    },
    onError: () => {
      // Even if logout API fails, clear local state
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
    },
  });
};
