import type { IConnection } from "@nestia/fetcher";
import type { IShoppingAuthorized } from "@benchmark/shopping-api";

import { apiConnection } from "./client";

const STORAGE_KEY = "benchmark-shopping-session";

export type Session = IShoppingAuthorized;

export function readSession(): Session | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function writeSession(session: Session): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  apiConnection.headers ??= {};
  apiConnection.headers.Authorization = session.token.access;
}

export function clearSession(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  const connection = apiConnection as IConnection & { headers?: Record<string, string> };
  if (connection.headers !== undefined) delete connection.headers.Authorization;
}

export function restoreSession(): Session | null {
  const session = readSession();
  if (session === null) return null;
  apiConnection.headers ??= {};
  apiConnection.headers.Authorization = session.token.access;
  return session;
}

