import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import type { IUser } from "@benchmark/todo-api";
import api from "@benchmark/todo-api";

import { AuthContext, type Session } from "./auth-context";
import { apiConnection } from "./client";
import { formatError } from "./session";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) throw new Error("AuthProvider is missing.");
  return context;
}

export function useAuthRequest(): { login: (body: IUser.ILogin) => Promise<Session>; join: (body: IUser.IJoin) => Promise<Session>; pending: boolean; error: string | null } {
  const { setSession } = useAuth();
  const mutation = useMutation({ mutationFn: async (input: { kind: "login" | "join"; body: IUser.ILogin | IUser.IJoin }) => input.kind === "login" ? api.functional.todo.auth.user.login(apiConnection, input.body as IUser.ILogin) : api.functional.todo.auth.user.join(apiConnection, input.body as IUser.IJoin), onSuccess: setSession });
  return { login: (body) => mutation.mutateAsync({ kind: "login", body }), join: (body) => mutation.mutateAsync({ kind: "join", body }), pending: mutation.isPending, error: mutation.error === null ? null : formatError(mutation.error) };
}

export function useRefreshSession(onSuccess?: (session: Session) => void) {
  return useMutation({ mutationFn: (refreshToken: string) => api.functional.todo.auth.user.refresh(apiConnection, { refreshToken }), onSuccess });
}
