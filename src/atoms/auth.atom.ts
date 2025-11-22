// atoms/auth.atom.ts
import { atom, getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { User } from "../types/auth";

export const store = getDefaultStore();

export const accessTokenAtom = atomWithStorage<string | null>("auth_token", null);
// Remove refresh token atom since it's handled by server cookies
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom<boolean>(false);

// Add initialization state to track if we've attempted to restore auth
export const authInitializedAtom = atom<boolean>(false);
