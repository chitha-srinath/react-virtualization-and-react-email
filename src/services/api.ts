// services/api.ts
import axios from "axios";
import { accessTokenAtom, refreshTokenAtom } from "../atoms/auth.atom";
import { getDefaultStore } from "jotai";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const store = getDefaultStore();

export const api = axios.create({
  baseURL: "http://localhost:3000/api", // your API base URL
  withCredentials: true, // required if using httpOnly cookies
});

api.interceptors.request.use(async (reqConfig) => {
  const token = store.get(accessTokenAtom);

  // If no token is present, proceed without authorization
  if (!token) {
    return reqConfig;
  }

  try {
    // Decode token and check expiration
    const decodedToken = jwtDecode<{ exp: number }>(token);
    const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 1;

    // If token is not expired, use it
    if (!isExpired) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
      return reqConfig;
    }

    // Token is expired, try to refresh it
    const refreshToken = store.get(refreshTokenAtom);
    if (!refreshToken) {
      // No refresh token available, proceed without authorization
      return reqConfig;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/refresh`,
        {
          refreshToken: refreshToken,
        }
      );

      const newAccessToken = response.data.accessToken;
      // Update the access token in Jotai atom
      store.set(accessTokenAtom, newAccessToken);

      // Use the new token for this request
      reqConfig.headers.Authorization = `Bearer ${newAccessToken}`;
      return reqConfig;
    } catch {
      // Refresh failed, clear tokens and proceed without authorization
      store.set(accessTokenAtom, null);
      store.set(refreshTokenAtom, null);
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
    if (error.response.status === 401) {
      store.set(accessTokenAtom, null);
      store.set(refreshTokenAtom, null);
    }
    return Promise.reject(error);
  }
);
