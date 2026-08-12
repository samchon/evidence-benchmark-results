import type { IUser } from "@benchmark/todo-api";

import { apiConnection } from "./client";

const STORAGE_KEY = "benchmark-todo.session";

export type Session = IUser.IAuthorized;

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? null : (JSON.parse(raw) as Session);
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null): void {
  if (session === null) localStorage.removeItem(STORAGE_KEY);
  else localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  if (session === null) {
    delete apiConnection.headers;
  } else {
    apiConnection.headers ??= {};
    apiConnection.headers.Authorization = session.token.access;
  }
}

export function formatError(error: unknown): string {
  if (error instanceof Error && error.message.length > 0) return error.message;
  return "That request could not be completed. Check the details and try again.";
}

