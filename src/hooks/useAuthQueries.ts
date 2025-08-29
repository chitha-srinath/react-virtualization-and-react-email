// hooks/useAuthQueries.ts
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  accessTokenAtom,
  userAtom,
  isAuthenticatedAtom,
} from "../atoms/auth.atom";
import { api } from "../services/api";
import axios from "axios";
import { env } from "../utils/env";
import type {
  TokenVerificationResponse,
  RefreshTokenResponse,
} from "../types/auth";

// Hook to initialize auth state on app load
export const useInitializeAuth = () => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  return useQuery<RefreshTokenResponse | null>({
    queryKey: ["refresh"],
    queryFn: async () => {
      try {
        const { data } = await axios.get<RefreshTokenResponse>(
          `${env?.VITE_API_URL}auth/access-token`,
          {
            withCredentials: true,
          }
        );
        setAccessToken(data.token);
        setIsAuthenticated(true); // Set authenticated state when token is retrieved
        return data;
      } catch (error) {
        // If token retrieval fails, ensure auth state is cleared
        setAccessToken(null);
        setIsAuthenticated(false);
        // Don't throw error in development mode when backend is not available
        console.warn(
          "Auth initialization failed (this is normal in development without backend):",
          error
        );
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 0, // Don't retry in development mode
    refetchOnWindowFocus: false,
  });
};

// Hook to verify a specific token via API call
export const useVerifyToken = (token: string | null) => {
  const setAccessToken = useSetAtom(accessTokenAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const setUser = useSetAtom(userAtom);
  const queryClient = useQueryClient();

  return useQuery<TokenVerificationResponse | null>({
    queryKey: ["verifyToken", token],
    queryFn: async (): Promise<TokenVerificationResponse | null> => {
      if (!token) return null;

      try {
        const { data } = await axios.get<TokenVerificationResponse>(
          `${env?.VITE_API_URL}auth/verify-access-token`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // If verification successful, update the atoms
        if (!data.error) {
          setAccessToken(token);
          setIsAuthenticated(true);

          // If user data is returned, update user atom
          if (data.data?.user) {
            setUser(data.data.user);
          }

          // Invalidate related queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["user"] });
          queryClient.invalidateQueries({ queryKey: ["checkToken"] });
        }

        return data;
      } catch (error) {
        // In development mode without backend, treat as invalid token
        console.warn(
          "Token verification failed (backend not available):",
          error
        );
        return { error: true, message: "Backend not available" };
      }
    },
    enabled: !!token, // Only run when we have a token
    staleTime: 1 * 60 * 1000, // 1 minute - cache verification results
    retry: 0, // Don't retry in development mode
    refetchOnWindowFocus: false, // Don't refetch on window focus for verification
    refetchOnReconnect: false, // Don't refetch when network reconnects in dev mode
  });
};

// Custom hook for fetching user data
export const useFetchUser = () => {
  const accessToken = useAtomValue(accessTokenAtom);

  return useQuery({
    queryKey: ["user", accessToken],
    queryFn: async () => {
      if (!accessToken) return null;
      const { data } = await api.get("/auth/user-details");
      return data.data;
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
      const res = await axios.post(
        `${env?.VITE_API_URL}auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
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
        await api.get("/auth/logout", { withCredentials: true });
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
