import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IPage, ITodo, ITodoHistory, IUser } from "@benchmark/todo-api";
import api from "@benchmark/todo-api";

import { useAuth } from "./auth-hooks";
import { apiConnection } from "./client";
import { formatError } from "./session";

export function useHealth() {
  return useQuery(
    queryOptions({
      queryKey: ["health"],
      queryFn: () => api.functional.health.get(apiConnection),
      staleTime: 60_000,
    }),
  );
}

export function useProfile() {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["profile"],
      queryFn: () => api.functional.todo.user.profile.at(apiConnection),
    }),
    enabled: status === "authenticated",
  });
}

export function useUpdateProfile() {
  const { session, setSession } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: IUser.IUpdateProfile) =>
      api.functional.todo.user.profile.update(apiConnection, body),
    onSuccess: (user) => {
      client.setQueryData(["profile"], user);
      if (session !== null) setSession({ ...session, user });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: IUser.IChangePassword) =>
      api.functional.todo.user.password.changePassword(apiConnection, body),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => api.functional.todo.user.logout(apiConnection),
  });
}

export function useLogoutAll() {
  return useMutation({
    mutationFn: () => api.functional.todo.user.logout_all.logoutAll(apiConnection),
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (body: IUser.IDeleteAccount) =>
      api.functional.todo.user.account._delete.deleteAccount(apiConnection, body),
  });
}

export function useRecoveryRequest() {
  return useMutation({
    mutationFn: (body: IUser.IRecoveryRequest) =>
      api.functional.todo.auth.user.recovery.request.recoveryRequest(apiConnection, body),
  });
}

export function useRecoveryConfirm() {
  const { setSession } = useAuth();
  return useMutation({
    mutationFn: (body: IUser.IRecoveryConfirm) =>
      api.functional.todo.auth.user.recovery.confirm.recoveryConfirm(apiConnection, body),
    onSuccess: setSession,
  });
}

export interface TodoListInput extends ITodo.IRequest {
  page: number;
  limit: number;
}

export function useTodoList(input: TodoListInput) {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["todos", input],
      queryFn: () => api.functional.todo.user.todo.index(apiConnection, input),
    }),
    enabled: status === "authenticated",
  });
}

export function useTodoDetail(id: string | null) {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["todo", id],
      queryFn: () => api.functional.todo.user.todo.at(apiConnection, id ?? ""),
    }),
    enabled: status === "authenticated" && id !== null,
  });
}

export function useTodoHistory(id: string | null) {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["history", id],
      queryFn: () => api.functional.todo.user.todo.history(apiConnection, id ?? ""),
    }),
    enabled: status === "authenticated" && id !== null,
  });
}

function invalidateTodos(client: ReturnType<typeof useQueryClient>, id?: string) {
  void client.invalidateQueries({ queryKey: ["todos"] });
  if (id !== undefined) {
    void client.invalidateQueries({ queryKey: ["todo", id] });
    void client.invalidateQueries({ queryKey: ["history", id] });
  }
}

export function useCreateTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (body: ITodo.ICreate) =>
      api.functional.todo.user.todo.create(apiConnection, body),
    onSuccess: () => invalidateTodos(client),
  });
}

export function useUpdateTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; body: ITodo.IUpdate }) =>
      api.functional.todo.user.todo.update(apiConnection, input.id, input.body),
    onSuccess: (todo) => {
      client.setQueryData(["todo", todo.id], todo);
      invalidateTodos(client, todo.id);
    },
  });
}

export function useCompleteTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.todo.complete(apiConnection, id),
    onSuccess: (todo) => {
      client.setQueryData(["todo", todo.id], todo);
      invalidateTodos(client, todo.id);
    },
  });
}

export function useIncompleteTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.todo.incomplete(apiConnection, id),
    onSuccess: (todo) => {
      client.setQueryData(["todo", todo.id], todo);
      invalidateTodos(client, todo.id);
    },
  });
}

export function useTrashTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.todo.trash(apiConnection, id),
    onSuccess: (todo) => {
      client.setQueryData(["todo", todo.id], todo);
      invalidateTodos(client, todo.id);
      void client.invalidateQueries({ queryKey: ["trash"] });
      void client.invalidateQueries({ queryKey: ["trash-detail", todo.id] });
    },
  });
}

export function useTrashList(page: number, limit: number) {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["trash", page, limit],
      queryFn: () => api.functional.todo.user.trash.index(apiConnection, { page, limit }),
    }),
    enabled: status === "authenticated",
  });
}

export function useTrashDetail(id: string | null) {
  const { status } = useAuth();
  return useQuery({
    ...queryOptions({
      queryKey: ["trash-detail", id],
      queryFn: () => api.functional.todo.user.trash.at(apiConnection, id ?? ""),
    }),
    enabled: status === "authenticated" && id !== null,
  });
}

export function useRestoreTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.trash.restore(apiConnection, id),
    onSuccess: (todo) => {
      invalidateTodos(client, todo.id);
      void client.invalidateQueries({ queryKey: ["trash"] });
      void client.invalidateQueries({ queryKey: ["trash-detail", todo.id] });
    },
  });
}

export function useEraseTodo() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.trash.erase(apiConnection, id),
    onSuccess: (_, id) => {
      void client.invalidateQueries({ queryKey: ["trash"] });
      void client.invalidateQueries({ queryKey: ["trash-detail", id] });
      void client.invalidateQueries({ queryKey: ["history", id] });
    },
  });
}

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown): value is string {
  return typeof value === "string";
}

function emailMessage(value: unknown): string | null {
  if (!stringValue(value) || value.trim().length === 0) return "Enter an email address.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? null
    : "Enter a valid email address.";
}

function passwordMessage(value: unknown, label: string): string | null {
  if (!stringValue(value) || value.length < 8 || value.length > 128)
    return `${label} must be 8 to 128 characters.`;
  return null;
}

function displayNameMessage(value: unknown): string | null {
  if (!stringValue(value) || value.trim().length < 1 || value.trim().length > 100)
    return "Display name must be 1 to 100 characters.";
  return null;
}

function contentMessage(value: RecordValue): string | null {
  if (!stringValue(value.title) || value.title.trim().length < 1 || value.title.trim().length > 200)
    return "Title must be 1 to 200 characters.";
  if (value.description !== undefined && value.description !== null) {
    if (!stringValue(value.description) || value.description.length > 10_000)
      return "Description must be at most 10,000 characters.";
  }
  const startDate = value.startDate;
  const dueDate = value.dueDate;
  const validDate = (date: unknown): date is string => {
    if (date === null || date === undefined) return true;
    if (!stringValue(date)) return false;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (match === null) return false;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
  };
  if (!validDate(startDate) || !validDate(dueDate)) return "Use valid calendar dates.";
  if (stringValue(startDate) && stringValue(dueDate) && dueDate < startDate)
    return "Due date must be on or after the start date.";
  return null;
}

export function validationMessage(value: unknown): string | null {
  if (!isRecord(value)) return "Check the form values.";
  if ("proof" in value) {
    const emailError = emailMessage(value.email);
    if (emailError !== null) return emailError;
    if (!stringValue(value.proof) || value.proof.trim().length === 0)
      return "Enter the recovery proof.";
    return passwordMessage(value.newPassword, "New password");
  }
  if ("email" in value) {
    const emailError = emailMessage(value.email);
    if (emailError !== null) return emailError;
  }
  if ("password" in value) {
    const passwordError = passwordMessage(value.password, "Password");
    if (passwordError !== null) return passwordError;
  }
  if ("displayName" in value) {
    const displayError = displayNameMessage(value.displayName);
    if (displayError !== null) return displayError;
  }
  if ("newPassword" in value) {
    const passwordError = passwordMessage(value.newPassword, "New password");
    if (passwordError !== null) return passwordError;
    if ("currentPassword" in value && value.currentPassword === value.newPassword)
      return "New password must differ from the current password.";
  }
  if ("title" in value) return contentMessage(value);
  if ("currentPassword" in value) {
    return !stringValue(value.currentPassword) || value.currentPassword.length === 0
      ? "Enter your current password."
      : null;
  }
  return null;
}

export { formatError };
