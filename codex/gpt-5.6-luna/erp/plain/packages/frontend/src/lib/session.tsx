import * as api from "@benchmark/erp-api";
import { useEffect, useState, type ReactNode } from "react";

import { apiConnection } from "@/lib/client";
import { useGeneratedErpAuthRefresh } from "@/lib/erp/hooks";
import { SessionContext } from "@/lib/session-context";
import type { Authorized, SessionStatus } from "@/lib/session-context";

function restoreAuth(): Authorized | null {
  const stored = globalThis.localStorage.getItem("benchmark-erp.session");
  if (stored === null) return null;
  try {
    const restored = JSON.parse(stored) as api.IUser.IAuthorized;
    if (typeof restored.accessToken === "string" && restored.user !== undefined) return restored;
  } catch {
    globalThis.localStorage.removeItem("benchmark-erp.session");
  }
  return null;
}

function setConnectionAuth(auth: Authorized | null): void {
  if (auth === null) {
    delete apiConnection.headers;
    return;
  }
  apiConnection.headers = { authorization: `Bearer ${auth.accessToken}` };
}

export function SessionProvider(props: { children: ReactNode }) {
  const refresh = useGeneratedErpAuthRefresh();
  const selectedMembership = globalThis.localStorage.getItem("benchmark-erp.membership");
  const [auth, setAuthState] = useState<Authorized | null>(() => {
    const restored = restoreAuth();
    setConnectionAuth(restored);
    return restored;
  });
  const [selectedMembershipId, setSelectedMembershipState] = useState<string | null>(selectedMembership);
  const [status, setStatus] = useState<SessionStatus>(auth === null ? "anonymous" : "restoring");
  useEffect(() => {
    if (auth === null || status !== "restoring") return;
    let mounted = true;
    void refresh.mutateAsync([{ refreshToken: auth.refreshToken }])
      .then((next) => {
        if (!mounted) return;
        setConnectionAuth(next);
        globalThis.localStorage.setItem("benchmark-erp.session", JSON.stringify(next));
        setAuthState(next);
        setStatus("authenticated");
        setSelectedMembershipState((current) => {
          const valid = next.memberships.some((membership) => membership.id === current && membership.status === "active");
          if (valid) return current;
          globalThis.localStorage.removeItem("benchmark-erp.membership");
          return null;
        });
      })
      .catch(() => {
        if (!mounted) return;
        setConnectionAuth(null);
        globalThis.localStorage.removeItem("benchmark-erp.session");
        globalThis.localStorage.removeItem("benchmark-erp.membership");
        setSelectedMembershipState(null);
        setAuthState(null);
        setStatus("anonymous");
      });
    return () => { mounted = false; };
  }, [auth, refresh.mutateAsync, status]);
  const setAuth = (next: Authorized) => {
    setConnectionAuth(next);
    globalThis.localStorage.setItem("benchmark-erp.session", JSON.stringify(next));
    globalThis.localStorage.removeItem("benchmark-erp.membership");
    setSelectedMembershipState(null);
    setAuthState(next);
    setStatus("authenticated");
  };
  const setSelectedMembershipId = (membershipId: string) => {
    globalThis.localStorage.setItem("benchmark-erp.membership", membershipId);
    setSelectedMembershipState(membershipId);
  };
  const clearAuth = () => {
    setConnectionAuth(null);
    globalThis.localStorage.removeItem("benchmark-erp.session");
    globalThis.localStorage.removeItem("benchmark-erp.membership");
    setSelectedMembershipState(null);
    setAuthState(null);
    setStatus("anonymous");
  };
  const value = { auth, status, selectedMembershipId, setAuth, setSelectedMembershipId, clearAuth };
  return <SessionContext.Provider value={value}>{props.children}</SessionContext.Provider>;
}
