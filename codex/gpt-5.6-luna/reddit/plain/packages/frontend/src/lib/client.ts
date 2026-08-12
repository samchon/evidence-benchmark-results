import type { IConnection } from "@nestia/fetcher";
import type { IAuth } from "@benchmark/reddit-api";

import { config } from "@/lib/config";

/** Shared generated-SDK connection for browser requests. */
export const apiConnection: IConnection = {
  host: config.apiHost,
  simulate: config.simulate,
};

const SESSION_KEY = "benchmark-reddit.session";

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: IAuth["user"];
}

export function applySession(session: StoredSession): void {
  apiConnection.headers = {
    ...apiConnection.headers,
    Authorization: `Bearer ${session.accessToken}`,
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  delete apiConnection.headers;
  window.localStorage.removeItem(SESSION_KEY);
}

export function readStoredSession(): StoredSession | null {
  const value = window.localStorage.getItem(SESSION_KEY);
  if (value === null) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "accessToken" in parsed &&
      "refreshToken" in parsed &&
      "user" in parsed &&
      typeof parsed.accessToken === "string" &&
      typeof parsed.refreshToken === "string"
    )
      return parsed as StoredSession;
  } catch {
    // A malformed local session is treated as anonymous state.
  }
  clearSession();
  return null;
}
