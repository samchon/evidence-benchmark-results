import * as api from "@benchmark/todo-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  apiConnection,
  clearSession,
  getSession,
  setSession,
} from "@/lib/client";

/**
 * Calls account registration and stores the issued session.
 * @evidence {@link api.functional.todo.auth.user.join_operation.join} Calls registration through the generated SDK and persists its issued session.
 * @evidenceReview {@link api.functional.todo.auth.user.join_operation.join} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useJoin() {
  return useMutation({
    mutationFn: (body: api.ITodoUser.IJoin) =>
      api.functional.todo.auth.user.join_operation.join(apiConnection, body),
    onSuccess: (session) => setSession(session),
  });
}

/**
 * Calls login and stores the newly issued independent session.
 * @evidence {@link api.functional.todo.auth.user.login_operation.login} Calls login through the generated SDK and persists its issued session.
 * @evidenceReview {@link api.functional.todo.auth.user.login_operation.login} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useLogin() {
  return useMutation({
    mutationFn: (body: api.ITodoUser.ILogin) =>
      api.functional.todo.auth.user.login_operation.login(apiConnection, body),
    onSuccess: (session) => setSession(session),
  });
}

/**
 * Starts non-disclosing email recovery.
 * @evidence {@link api.functional.todo.auth.user.recover_operation.recover} Calls the generated recovery-start operation without exposing account lookup.
 * @evidenceReview {@link api.functional.todo.auth.user.recover_operation.recover} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useRecoveryStart() {
  return useMutation({
    mutationFn: (body: api.ITodoUser.IRecover) =>
      api.functional.todo.auth.user.recover_operation.recover(apiConnection, body),
  });
}

/**
 * Consumes a delivered proof and replaces the forgotten password.
 * @evidence {@link api.functional.todo.auth.user.recover.reset_operation.reset} Calls the generated one-time recovery reset operation.
 * @evidenceReview {@link api.functional.todo.auth.user.recover.reset_operation.reset} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useRecoveryReset() {
  return useMutation({
    mutationFn: (body: api.ITodoUser.IReset) =>
      api.functional.todo.auth.user.recover.reset_operation.reset(apiConnection, body),
    onSuccess: () => clearSession(),
  });
}

/**
 * Continues the persisted authenticated session with its refresh proof.
 * @evidence {@link api.functional.todo.auth.user.refresh_operation.refresh} Calls the generated session continuation operation and replaces the stored session.
 * @evidenceReview {@link api.functional.todo.auth.user.refresh_operation.refresh} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useRefresh() {
  return useMutation({
    mutationFn: async (refreshToken?: string) => {
      const token = refreshToken ?? getSession()?.token.refresh;
      if (token === undefined) throw new Error("No refresh session is available.");
      return api.functional.todo.auth.user.refresh_operation.refresh(apiConnection, {
        refreshToken: token,
      });
    },
    onSuccess: (session) => setSession(session),
    onError: () => clearSession(),
  });
}

/**
 * Changes the authenticated account password.
 * @evidence {@link api.functional.todo.user.password.changePassword} Calls the generated password replacement operation.
 * @evidenceReview {@link api.functional.todo.user.password.changePassword} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (body: api.ITodoUser.IChangePassword) =>
      api.functional.todo.user.password.changePassword(apiConnection, body),
    onSuccess: () => clearSession(),
  });
}

/**
 * Ends only the current authenticated session.
 * @evidence {@link api.functional.todo.user.logout_operation.logout} Calls the generated current-session logout operation.
 * @evidenceReview {@link api.functional.todo.user.logout_operation.logout} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.functional.todo.user.logout_operation.logout(apiConnection),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

/**
 * Ends every session for the authenticated account.
 * @evidence {@link api.functional.todo.user.logout_all.logoutAll} Calls the generated all-session logout operation.
 * @evidenceReview {@link api.functional.todo.user.logout_all.logoutAll} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useLogoutAll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.functional.todo.user.logout_all.logoutAll(apiConnection),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

/**
 * Permanently deletes the authenticated account.
 * @evidence {@link api.functional.todo.user.account_delete.erase} Calls the generated terminal account-deletion operation.
 * @evidenceReview {@link api.functional.todo.user.account_delete.erase} Read the generated SDK accessor and inspected this hook mutation plus its session and error handling.
 */
export function useAccountDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: api.ITodoUser.IDelete) =>
      api.functional.todo.user.account_delete.erase(apiConnection, body),
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
