// services/api.ts
import axios from "axios";
import { accessTokenAtom, isAuthenticatedAtom, userAtom } from "../atoms/auth.atom";
import { getDefaultStore } from "jotai";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const store = getDefaultStore();

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // required if using httpOnly cookies
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(async (reqConfig) => {
  const token = store.get(accessTokenAtom);

  // If no token is present, proceed without authorization
  if (!token) {
    return reqConfig;
  }

  try {
    // Decode token and check expiration
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 60000; // 1 minute buffer

    // If token is not expired, use it
    if (!isExpired) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
      return reqConfig;
    }

    // Token is expired, try to refresh it
    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        reqConfig.headers.Authorization = `Bearer ${token}`;
        return reqConfig;
      }).catch(() => {
        return reqConfig;
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      // Update the access token in Jotai atom
      store.set(accessTokenAtom, newAccessToken);
      
      processQueue(null, newAccessToken);
      isRefreshing = false;

      // Use the new token for this request
      reqConfig.headers.Authorization = `Bearer ${newAccessToken}`;
      return reqConfig;
    } catch {
      // Refresh failed, clear tokens and proceed without authorization
      store.set(accessTokenAtom, null);
      store.set(isAuthenticatedAtom, false);
      store.set(userAtom, null);
      
      processQueue(new Error('Token refresh failed'), null);
      isRefreshing = false;
      
      return reqConfig;
    }
  } catch {
    // Token decode failed, clear it and proceed without authorization
    store.set(accessTokenAtom, null);
    return reqConfig;
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.set(accessTokenAtom, null);
      store.set(isAuthenticatedAtom, false);
      store.set(userAtom, null);
    }
    return Promise.reject(error);
  }
);
