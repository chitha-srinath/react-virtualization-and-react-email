// services/api.ts
import axios from "axios";
import {
  accessTokenAtom,
  isAuthenticatedAtom,
  store,
  userAtom,
} from "../atoms/auth.atom";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { getAccessToken } from "./auth-client";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // required if using httpOnly cookies
});

api.interceptors.request.use(async (reqConfig) => {
  const token = store.get(accessTokenAtom);

  if (!token) {
    return reqConfig;
  }
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 60000; // 1 minute buffer

  if (isExpired) {
    await getAccessToken();
  }
  reqConfig.headers.Authorization = `Bearer ${token}`;
  return reqConfig;
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
