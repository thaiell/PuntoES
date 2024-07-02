import { atom } from "nanostores";
import type { UserSession } from "../lib/types";

export const $user = atom<UserSession | null>(null)

export const setUserAtom = (user: UserSession) => $user.set(user)

