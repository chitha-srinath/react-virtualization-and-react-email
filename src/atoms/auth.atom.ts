// atoms/auth.atom.ts
import { atom } from "jotai";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const accessTokenAtom = atom<string | null>(null);
export const refreshTokenAtom = atom<string | null>(null);
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);
