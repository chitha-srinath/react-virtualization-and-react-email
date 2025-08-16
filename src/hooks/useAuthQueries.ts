// hooks/useAuthQueries.ts
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  accessTokenAtom,
  userAtom,
  isAuthenticatedAtom,
  store,
} from "../atoms/auth.atom";
import { api } from "../services/api";
import axios from "axios";
import { env } from "../utils/env";

// Hook to initialize auth state on app load
export const useInitializeAuth = () => {
  return useQuery({
    queryKey: ["refresh"],
    queryFn: async () => {
      const { data } = await axios.get<{ token: string }>(
        `${env?.VITE_API_URL}auth/access-token`,
        {
          withCredentials: true,
        }
      );
      store.set(accessTokenAtom, data.token);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

// Custom hook for fetching user data
export const useFetchUser = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  return useQuery({
    queryKey: ["user", accessToken],
    queryFn: async () => {
      if (!accessToken) return null;
      const res = await api.get("/auth/getUserInfo");
      return res.data;
    },
    enabled: !!accessToken, // Only run query when we have an access token
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      const res = await axios.post(`${env?.VITE_API_URL}auth/login`, {
        email,
        password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.data.token);
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
      const res = await axios.post("/auth/register", {
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
        await api.get("/auth/logout");
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
