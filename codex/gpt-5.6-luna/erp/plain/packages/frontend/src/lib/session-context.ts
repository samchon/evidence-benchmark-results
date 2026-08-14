import { createContext } from "react";
import type * as api from "@benchmark/erp-api";

export type Authorized = api.IUser.IAuthorized;
export type SessionStatus = "anonymous" | "restoring" | "authenticated";

export interface SessionContextValue {
  auth: Authorized | null;
  status: SessionStatus;
  selectedMembershipId: string | null;
  setAuth: (auth: Authorized) => void;
  setSelectedMembershipId: (membershipId: string) => void;
  clearAuth: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
