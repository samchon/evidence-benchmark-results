import type { IConnection } from "@nestia/fetcher";

import { config } from "@/lib/config";

/** Shared generated-SDK connection for browser requests. */
export const apiConnection: IConnection = {
  host: config.apiHost,
  simulate: config.simulate,
};

export type ActorKind = "customer" | "seller";
export interface StoredSession {
  actor: ActorKind;
  accessToken: string;
  refreshToken: string;
  identity: { id: string; email: string; grades: string[] };
}

const SESSION_KEY = "benchmark-shopping.session";

export function saveSession(session: StoredSession): void {
  apiConnection.headers = { Authorization: `Bearer ${session.accessToken}` };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function readSession(): StoredSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === null) return null;
  try {
    const session = JSON.parse(raw) as StoredSession;
    if (typeof session.accessToken !== "string" || typeof session.refreshToken !== "string") return null;
    apiConnection.headers = { Authorization: `Bearer ${session.accessToken}` };
    return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  delete apiConnection.headers;
  window.localStorage.removeItem(SESSION_KEY);
}
