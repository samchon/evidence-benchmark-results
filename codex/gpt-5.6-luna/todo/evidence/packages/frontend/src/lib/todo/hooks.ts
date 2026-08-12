import * as api from "@benchmark/todo-api";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiConnection } from "@/lib/client";
import { useSession } from "@/lib/auth/session";

const todoKeys = {
  root: ["todo"] as const,
  all: ["todo", "todos"] as const,
  list: (body: api.ITodoTodo.IRequest) => ["todo", "todos", "list", body] as const,
  detail: (id: string | null) => ["todo", "todos", "detail", id] as const,
  history: (id: string | null) => ["todo", "todos", "history", id] as const,
  trashList: (body: api.IPage.IRequest) => ["todo", "trash", "list", body] as const,
  trashDetail: (id: string | null) => ["todo", "trash", "detail", id] as const,
};

const enabledForSession = (status: "anonymous" | "authenticated"): boolean =>
  status === "authenticated";

const activeListOptions = (body: api.ITodoTodo.IRequest) =>
  queryOptions({
    queryKey: todoKeys.list(body),
    queryFn: () => api.functional.todo.user.todo.list.index(apiConnection, body),
  });

const detailOptions = (id: string | null) =>
  queryOptions({
    queryKey: todoKeys.detail(id),
    queryFn: () => api.functional.todo.user.todo.detail.at(apiConnection, id as string),
  });

const historyOptions = (id: string | null) =>
  queryOptions({
    queryKey: todoKeys.history(id),
    queryFn: () => api.functional.todo.user.todo.history.index(apiConnection, id as string),
  });

const trashListOptions = (body: api.IPage.IRequest) =>
  queryOptions({
    queryKey: todoKeys.trashList(body),
    queryFn: () => api.functional.todo.user.trash.list.index(apiConnection, body),
  });

const trashDetailOptions = (id: string | null) =>
  queryOptions({
    queryKey: todoKeys.trashDetail(id),
    queryFn: () => api.functional.todo.user.trash.detail.at(apiConnection, id as string),
  });

/**
 * Reads the authenticated user's active Todo page.
 * @evidence {@link api.functional.todo.user.todo.list.index} Calls the generated active Todo list operation with the current filter and paging controls.
 * @evidenceReview {@link api.functional.todo.user.todo.list.index} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTodoList(body: api.ITodoTodo.IRequest) {
  const session = useSession();
  return useQuery({
    ...activeListOptions(body),
    enabled: enabledForSession(session.status),
  });
}

/**
 * Reads one owned active Todo.
 * @evidence {@link api.functional.todo.user.todo.detail.at} Calls the generated active Todo detail operation for the selected id.
 * @evidenceReview {@link api.functional.todo.user.todo.detail.at} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTodoDetail(id: string | null) {
  const session = useSession();
  return useQuery({
    ...detailOptions(id),
    enabled: enabledForSession(session.status) && id !== null,
  });
}

/**
 * Reads the complete immutable history for one owned Todo.
 * @evidence {@link api.functional.todo.user.todo.history.index} Calls the generated full Todo history operation for the selected id.
 * @evidenceReview {@link api.functional.todo.user.todo.history.index} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTodoHistory(id: string | null) {
  const session = useSession();
  return useQuery({
    ...historyOptions(id),
    enabled: enabledForSession(session.status) && id !== null,
  });
}

/**
 * Creates one active incomplete Todo.
 * @evidence {@link api.functional.todo.user.todo.create_operation.create} Calls the generated Todo creation operation and refreshes active views.
 * @evidenceReview {@link api.functional.todo.user.todo.create_operation.create} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: api.ITodoTodo.ICreate) =>
      api.functional.todo.user.todo.create_operation.create(apiConnection, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.root }),
  });
}

/**
 * Applies an optimistic-versioned content edit.
 * @evidence {@link api.functional.todo.user.todo.edit.update} Calls the generated Todo content-edit operation and refreshes its detail and history.
 * @evidenceReview {@link api.functional.todo.user.todo.edit.update} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; body: api.ITodoTodo.IUpdate }) =>
      api.functional.todo.user.todo.edit.update(apiConnection, input.id, input.body),
    onSuccess: (todo, input) => {
      queryClient.setQueryData(todoKeys.detail(input.id), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.history(input.id) });
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}

/**
 * Marks one active Todo complete.
 * @evidence {@link api.functional.todo.user.todo.complete_operation.complete} Calls the generated idempotent completion operation and refreshes active views.
 * @evidenceReview {@link api.functional.todo.user.todo.complete_operation.complete} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useCompleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.functional.todo.user.todo.complete_operation.complete(apiConnection, id),
    onSuccess: (todo) => {
      queryClient.setQueryData(todoKeys.detail(todo.id), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}

/**
 * Marks one active Todo incomplete.
 * @evidence {@link api.functional.todo.user.todo.incomplete_operation.incomplete} Calls the generated idempotent incompletion operation and refreshes active views.
 * @evidenceReview {@link api.functional.todo.user.todo.incomplete_operation.incomplete} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useIncompleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.functional.todo.user.todo.incomplete_operation.incomplete(apiConnection, id),
    onSuccess: (todo) => {
      queryClient.setQueryData(todoKeys.detail(todo.id), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}

/**
 * Moves one active Todo to trash.
 * @evidence {@link api.functional.todo.user.todo.trash.erase} Calls the generated soft-delete operation and refreshes active and trash views.
 * @evidenceReview {@link api.functional.todo.user.todo.trash.erase} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTrashTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.functional.todo.user.todo.trash.erase(apiConnection, id),
    onSuccess: (todo) => {
      queryClient.setQueryData(todoKeys.trashDetail(todo.id), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}

/**
 * Reads the authenticated user's trashed Todo page.
 * @evidence {@link api.functional.todo.user.trash.list.index} Calls the generated trash list operation with shared pagination controls.
 * @evidenceReview {@link api.functional.todo.user.trash.list.index} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTrashList(body: api.IPage.IRequest) {
  const session = useSession();
  return useQuery({
    ...trashListOptions(body),
    enabled: enabledForSession(session.status),
  });
}

/**
 * Reads one owned Todo from trash.
 * @evidence {@link api.functional.todo.user.trash.detail.at} Calls the generated trashed Todo detail operation for the selected id.
 * @evidenceReview {@link api.functional.todo.user.trash.detail.at} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useTrashDetail(id: string | null) {
  const session = useSession();
  return useQuery({
    ...trashDetailOptions(id),
    enabled: enabledForSession(session.status) && id !== null,
  });
}

/**
 * Restores one trashed Todo to active work.
 * @evidence {@link api.functional.todo.user.trash.restore} Calls the generated restore operation and refreshes active and trash views.
 * @evidenceReview {@link api.functional.todo.user.trash.restore} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function useRestoreTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.functional.todo.user.trash.restore(apiConnection, id),
    onSuccess: (todo) => {
      queryClient.setQueryData(todoKeys.detail(todo.id), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}

/**
 * Permanently deletes one trashed Todo.
 * @evidence {@link api.functional.todo.user.trash._delete.erase} Calls the generated terminal Todo deletion operation and refreshes trash views.
 * @evidenceReview {@link api.functional.todo.user.trash._delete.erase} Read the generated SDK accessor and inspected this hook query or mutation plus its Todo-cache invalidation.
 */
export function usePermanentDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.functional.todo.user.trash._delete.erase(apiConnection, id),
    onSuccess: (_result, id) => {
      queryClient.removeQueries({ queryKey: todoKeys.trashDetail(id) });
      void queryClient.invalidateQueries({ queryKey: todoKeys.root });
    },
  });
}
