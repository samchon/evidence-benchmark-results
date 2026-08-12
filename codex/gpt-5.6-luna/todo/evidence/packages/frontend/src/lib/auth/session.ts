import { useSyncExternalStore } from "react";

import {
  getSession,
  subscribeSession,
  type AuthSession,
} from "@/lib/client";

export type SessionState =
  | { status: "anonymous"; session: null }
  | { status: "authenticated"; session: AuthSession };

export function useSession(): SessionState {
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
    getSession,
  );
  return session === null
    ? { status: "anonymous", session: null }
    : { status: "authenticated", session };
}
