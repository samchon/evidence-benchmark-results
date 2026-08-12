import type { IConnection } from "@nestia/fetcher";
import type { ITodoUser } from "@benchmark/todo-api";

import { config } from "@/lib/config";

/** Shared generated-SDK connection for browser requests. */
export const apiConnection: IConnection = {
  host: config.apiHost,
  simulate: config.simulate,
};

export type AuthSession = Pick<ITodoUser.IAuthorized, "id" | "token">;

const STORAGE_KEY = "benchmark-todo.session";
const listeners = new Set<() => void>();

const readStoredSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (
      typeof session.id !== "string" ||
      typeof session.token?.access !== "string" ||
      typeof session.token.refresh !== "string"
    )
      return null;
    return session;
  } catch {
    return null;
  }
};

let currentSession: AuthSession | null = readStoredSession();
if (currentSession !== null)
  apiConnection.headers = {
    ...apiConnection.headers,
    Authorization: `Bearer ${currentSession.token.access}`,
  };

export const getSession = (): AuthSession | null => currentSession;

export const subscribeSession = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setSession = (session: AuthSession): void => {
  currentSession = session;
  apiConnection.headers = {
    ...apiConnection.headers,
    Authorization: `Bearer ${session.token.access}`,
  };
  if (typeof window !== "undefined")
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  for (const listener of listeners) listener();
};

export const clearSession = (): void => {
  currentSession = null;
  if (apiConnection.headers !== undefined) {
    const headers = { ...apiConnection.headers };
    delete headers.Authorization;
    delete headers.authorization;
    apiConnection.headers = headers;
  }
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  for (const listener of listeners) listener();
};
