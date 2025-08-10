// atoms/auth.atom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export const accessTokenAtom = atom<string | null>(null);
// Remove refresh token atom since it's handled by server cookies
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);

// Add initialization state to track if we've attempted to restore auth
export const authInitializedAtom = atom<boolean>(false);
