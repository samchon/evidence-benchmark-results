import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AuthContext, type AuthStatus, type Session } from "./auth-context";
import { useRefreshSession } from "./auth-hooks";
import { apiConnection } from "./client";
import { readSession, writeSession } from "./session";

export function AuthProvider(props: { children: ReactNode }) {
  const client = useQueryClient();
  const [session, setSessionState] = useState<Session | null>(() => readSession());
  const [status, setStatus] = useState<AuthStatus>(() => readSession() === null ? "anonymous" : "restoring");
  const setSession = useCallback((next: Session | null) => {
    setSessionState(next);
    setStatus(next === null ? "anonymous" : "authenticated");
    writeSession(next);
  }, [writeSession]);
  const refresh = useRefreshSession(setSession);
  const { mutateAsync } = refresh;
  const signOut = useCallback(() => {
    setSession(null);
    client.removeQueries({ queryKey: ["profile"] });
    client.removeQueries({ queryKey: ["todos"] });
    client.removeQueries({ queryKey: ["todo"] });
    client.removeQueries({ queryKey: ["history"] });
    client.removeQueries({ queryKey: ["trash"] });
    client.removeQueries({ queryKey: ["trash-detail"] });
  }, [client, setSession]);
  useEffect(() => {
    const current = readSession();
    if (current === null) return;
    apiConnection.headers ??= {};
    apiConnection.headers.Authorization = current.token.access;
    void mutateAsync(current.refreshToken).then(setSession).catch(() => signOut());
  }, [apiConnection, mutateAsync, readSession, setSession, signOut]);
  const value = useMemo(() => ({ session, status, setSession, signOut }), [session, status, setSession, signOut]);
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
