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
    const { data } = await axios.get<{ token: string }>(
      `${env?.VITE_API_URL}auth/access-token`,
      {
        withCredentials: true,
      }
    );

    store.set(accessTokenAtom, data.token);
    return data.token;
  } catch (error) {
    console.error(error);
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
