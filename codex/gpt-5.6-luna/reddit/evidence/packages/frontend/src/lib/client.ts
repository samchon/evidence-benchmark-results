import type { IConnection } from "@nestia/fetcher";

import { config } from "@/lib/config";

const ACCESS_TOKEN_KEY = "reddit.access-token";
const REFRESH_TOKEN_KEY = "reddit.refresh-token";

/** Shared generated-SDK connection for browser requests. */
export const apiConnection: IConnection = {
  host: config.apiHost,
  simulate: config.simulate,
};

export function restoreSession(): { accessToken: string; refreshToken: string } | null {
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  if (accessToken === null || refreshToken === null) return null;
  apiConnection.headers = {
    ...apiConnection.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  return { accessToken, refreshToken };
}

export function saveSession(accessToken: string, refreshToken: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  apiConnection.headers = {
    ...apiConnection.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  window.dispatchEvent(new Event("reddit-session-change"));
}

export function clearSession(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  const headers = { ...apiConnection.headers };
  delete headers.Authorization;
  apiConnection.headers = headers;
  window.dispatchEvent(new Event("reddit-session-change"));
}

export function storedRefreshToken(): string | null {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}
