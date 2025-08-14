import axios from "axios";
import { accessTokenAtom, store } from "../atoms/auth.atom";

export async function getAccessToken() {
  try {
    const { data } = await axios.get<{ accessToken: string }>("/api/refresh", {
      withCredentials: true,
    });
    store.set(accessTokenAtom, data.accessToken);
    return data.accessToken;
  } catch (err) {
    console.error(err);
    store.set(accessTokenAtom, null);
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    const { data } = await axios.post<{ accessToken: string }>(
      "/api/login",
      payload
    );
    store.set(accessTokenAtom, data.accessToken);
    return data.accessToken;
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
