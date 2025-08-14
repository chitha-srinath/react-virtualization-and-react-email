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
import { env } from "../utils/env";

export const api = axios.create({
  baseURL: env?.VITE_API_URL,
});

api.interceptors.request.use(async (reqConfig) => {
  const token = store.get(accessTokenAtom);

  if (!token) {
    return reqConfig;
  }
  const decodedToken = jwtDecode<{ exp: number }>(token);
  // check 30 second buffer to refresh before actual expiration
  const isExpired = dayjs.unix(decodedToken.exp).diff(dayjs()) < 30000;

  if (isExpired) {
    await getAccessToken();
  }

  reqConfig.headers.Authorization = `Bearer ${store.get(accessTokenAtom)}`;
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
