import type { IConnection } from "@nestia/fetcher";
import { useContext } from "react";

import { apiConnection } from "@/lib/client";
import { SessionContext } from "@/lib/session-context";
import type { SessionContextValue } from "@/lib/session-context";

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (value === null) throw new Error("useSession must be used inside SessionProvider.");
  return value;
}

export function getConnection(): IConnection {
  return apiConnection;
}
