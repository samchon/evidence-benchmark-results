import { createContext, useContext } from "react";

import type { StoredSession } from "@/lib/client";

export interface SessionContextValue {
  session: StoredSession | null;
  signIn: (session: StoredSession) => void;
  signOut: () => void;
}

export const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null) throw new Error(
    "useSession must be used inside AppProviders.",
  );
  return value;
}
