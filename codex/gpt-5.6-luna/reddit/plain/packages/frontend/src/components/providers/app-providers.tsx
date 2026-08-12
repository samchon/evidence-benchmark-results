import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import {
  applySession,
  clearSession,
  readStoredSession,
  type StoredSession,
} from "@/lib/client";
import { SessionContext, type SessionContextValue } from "@/lib/session";

/** Installs the shared routing, query, and notification providers. */
export function AppProviders(props: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 20_000,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );
  const [session, setSession] = useState<StoredSession | null>(() => {
    const stored = readStoredSession();
    if (stored !== null) applySession(stored);
    return stored;
  });
  const sessionValue = useMemo<SessionContextValue>(
    () => ({
      session,
      signIn: (next) => {
        applySession(next);
        setSession(next);
      },
      signOut: () => {
        clearSession();
        setSession(null);
      },
    }),
    [session],
  );
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={sessionValue}>
          {props.children}
        </SessionContext.Provider>
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
