import axios from "axios";
import {
  accessTokenAtom,
  isAuthenticatedAtom,
  store,
  userAtom,
} from "../atoms/auth.atom";
import { env } from "../utils/env";

export async function getAccessToken() {
  try {
    console.log("getAccessToken: Fetching token...");
    const { data } = await axios.get<any>(
      `${env?.VITE_API_URL}auth/access-token`,
      {
        withCredentials: true,
      }
    );

    console.log("getAccessToken: Raw response data:", JSON.stringify(data, null, 2));

    // Handle various possible response structures
    // @ts-ignore - data type is generic
    const token = data.token || data.data?.token || data.data;

    console.log("getAccessToken: Extracted token:", token);

    if (token && typeof token === "string") {
      store.set(accessTokenAtom, token);
      store.set(isAuthenticatedAtom, true); // Explicitly set authenticated
      return token;
    }

    console.warn("getAccessToken: No valid token found in response. Structure keys:", Object.keys(data));
    return null;
  } catch (error) {
    console.error("getAccessToken: Error details:", error);
    if (axios.isAxiosError(error)) {
      console.error("getAccessToken: Axios error response:", error.response?.data);
      console.error("getAccessToken: Axios error status:", error.response?.status);
    }
    store.set(accessTokenAtom, null);
    store.set(isAuthenticatedAtom, false);
    store.set(userAtom, null);
    return null;
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    const { data } = await axios.post<{ token: string }>(
      `${env?.VITE_API_URL}auth/login`,
      payload,
      {
        withCredentials: true,
      }
    );
    store.set(accessTokenAtom, data.token);
    return data.token;
  } catch (err) {
    console.error(err);
    store.set(accessTokenAtom, null);
  }
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const { data } = await axios.post<{ accessToken: string }>(
      "/api/register",
      payload
    );
    store.set(accessTokenAtom, data.accessToken);
  } catch (err) {
    console.error(err);
    store.set(accessTokenAtom, null);
  }
}

export async function logout() {
  try {
    await axios.get<{ accessToken: string }>("/api/logout");
    store.set(accessTokenAtom, null);
  } catch (err) {
    console.error(err);
    store.set(accessTokenAtom, null);
  }
}
