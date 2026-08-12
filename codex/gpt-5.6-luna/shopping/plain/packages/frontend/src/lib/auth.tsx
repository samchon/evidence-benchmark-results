/* Restoration intentionally updates auth state after the refresh request. */
/* eslint-disable react/set-state-in-effect, react/exhaustive-deps */
import * as api from "@benchmark/shopping-api";
/* Auth mutations are stable operations exposed by the domain hook. */
/* eslint-disable tanstack-query/no-unstable-deps, react/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearSession, readSession, restoreSession, writeSession, type Session } from "./session";
import { useShoppingOperations } from "./shopping/hooks";

type ActorKind = "customer" | "seller";

interface AuthContextValue {
  status: "restoring" | "anonymous" | "authenticated";
  session: Session | null;
  actorType: ActorKind | null;
  signIn: (kind: ActorKind, body: api.IShoppingCustomer.ILogin | api.IShoppingSeller.ILogin) => Promise<Session>;
  register: (kind: ActorKind, body: api.IShoppingCustomer.IJoin | api.IShoppingSeller.IJoin) => Promise<Session>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => readSession());
  const [status, setStatus] = useState<AuthContextValue["status"]>("restoring");
  const operations = useShoppingOperations();
  useEffect(() => {
    let active = true;
    const stored = restoreSession();
    if (stored === null) {
      setStatus("anonymous");
      return () => { active = false; };
    }
    const refresh = stored.actor.type === "customer"
      ? operations.auth.customerRefresh({ refreshToken: stored.token.refresh })
      : operations.auth.sellerRefresh({ refreshToken: stored.token.refresh });
    void refresh.then((next) => {
      if (active) { writeSession(next); setSession(next); setStatus("authenticated"); }
    }).catch(() => {
      if (active) { clearSession(); setSession(null); setStatus("anonymous"); }
    });
    return () => { active = false; };
  }, []);
  const value = useMemo<AuthContextValue>(() => ({
    status,
    session,
    actorType: session?.actor.type ?? null,
    signIn: async (kind, body) => {
      const next = kind === "customer"
        ? await operations.auth.customerLogin(body as api.IShoppingCustomer.ILogin)
        : await operations.auth.sellerLogin(body as api.IShoppingSeller.ILogin);
      writeSession(next);
      setSession(next);
      setStatus("authenticated");
      return next;
    },
    register: async (kind, body) => {
      const next = kind === "customer"
        ? await operations.auth.customerJoin(body as api.IShoppingCustomer.IJoin)
        : await operations.auth.sellerJoin(body as api.IShoppingSeller.IJoin);
      writeSession(next);
      setSession(next);
      setStatus("authenticated");
      return next;
    },
    signOut: async () => {
      try {
        if (session !== null) {
          if (session.actor.type === "customer")
            await operations.customer.logout();
          else await operations.seller.logout();
        }
      } catch {
        // Account closure and an already-expired session can invalidate the
        // remote logout call; local authority must still be cleared.
      } finally {
        clearSession();
        setSession(null);
        setStatus("anonymous");
      }
    },
  }), [operations, session, status]);
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (value === null) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
