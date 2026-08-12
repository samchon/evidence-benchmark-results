import type { IUser } from "@benchmark/todo-api";
import { createContext } from "react";

export type Session = IUser.IAuthorized;
export type AuthStatus = "restoring" | "anonymous" | "authenticated";
export interface AuthContextValue { session: Session | null; status: AuthStatus; setSession: (next: Session | null) => void; signOut: () => void; }
export const AuthContext = createContext<AuthContextValue | null>(null);
