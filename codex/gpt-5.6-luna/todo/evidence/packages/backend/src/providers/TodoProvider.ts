import { randomUUID } from "node:crypto";
import type { IPage, ITodo, ITodoCompletion, ITodoCreate, ITodoHistory, ITodoRequest, ITodoSummary, ITodoUpdate } from "@benchmark/todo-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { AuthProvider } from "./AuthProvider";

/** Owns Todo visibility, lifecycle, content, and immutable history rules. */
export namespace TodoProvider {
  /** Creates one active incomplete Todo. */
  export async function create(actor: AuthProvider.Payload, body: ITodoCreate): Promise<ITodo> {
    const title = body.title.trim();
    if (title.length === 0 || title.length > 200) throw ErrorUtil.unprocessable("Title must contain 1 to 200 characters.");
    validateDates(body.startDate, body.dueDate);
    const row = await MyGlobal.prisma.todo_todos.create({ data: { id: randomUUID(), todo_account_id: actor.id, title, description: body.description ?? null, start_date: date(body.startDate), due_date: date(body.dueDate), completed: false, created_at: new Date(), updated_at: new Date(), trashed_at: null } });
    return transform(row);
  }

  /** Lists active or trashed Todos with bounded, deterministic pagination. */
  export async function index(actor: AuthProvider.Payload, input: ITodoRequest, trash = false): Promise<IPage<ITodoSummary>> {
    const page = input.page ?? 1; const limit = input.limit ?? 20;
    if (page < 1 || limit < 1 || limit > 100) throw ErrorUtil.unprocessable("Page must be at least 1 and limit must be from 1 to 100.");
    if (!trash && input.filter !== undefined && input.filter !== null && !["all", "complete-only", "incomplete-only"].includes(input.filter)) throw ErrorUtil.unprocessable("Unsupported completion filter.");
    if (!trash && input.sort !== undefined && input.sort !== null && !["createdAt", "startDate", "dueDate"].includes(input.sort)) throw ErrorUtil.unprocessable("Unsupported sort field.");
    if (!trash && input.direction !== undefined && input.direction !== null && !["asc", "desc"].includes(input.direction)) throw ErrorUtil.unprocessable("Unsupported sort direction.");
    const rows = await MyGlobal.prisma.todo_todos.findMany({ where: { todo_account_id: actor.id, trashed_at: trash ? { not: null } : null, ...(trash || input.filter === undefined || input.filter === null || input.filter === "all" ? {} : { completed: input.filter === "complete-only" }) } });
    rows.sort((a, b) => {
      if (trash) return compareDate(b.trashed_at, a.trashed_at) || compareDate(b.created_at, a.created_at) || a.id.localeCompare(b.id);
      const field = input.sort ?? "createdAt"; const direction = input.direction ?? "desc";
      const av = field === "createdAt" ? a.created_at : field === "startDate" ? a.start_date : a.due_date;
      const bv = field === "createdAt" ? b.created_at : field === "startDate" ? b.start_date : b.due_date;
      const result = field === "createdAt" ? compareDate(av, bv) : compareNullableDate(av, bv);
      return (direction === "asc" ? result : -result) || compareDate(b.created_at, a.created_at) || a.id.localeCompare(b.id);
    });
    const records = rows.length; const data = rows.slice((page - 1) * limit, page * limit).map(summary);
    return { data, pagination: { current: page, limit, records, pages: Math.ceil(records / limit) } };
  }

  /** Reads one owned Todo in the requested availability state. */
  export async function at(actor: AuthProvider.Payload, id: string, trash = false): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: trash ? { not: null } : null } });
    if (row === null) throw ErrorUtil.notFound("No such Todo.");
    return transform(row);
  }

  /** Applies a real active-content edit and appends exactly one history row. */
  export async function update(actor: AuthProvider.Payload, id: string, body: ITodoUpdate): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: null } });
    if (row === null) throw ErrorUtil.notFound("No such active Todo.");
    if (body.expectedUpdatedAt !== undefined && body.expectedUpdatedAt !== null && row.updated_at.toISOString() !== body.expectedUpdatedAt) throw ErrorUtil.conflict("The Todo changed after editing began.");
    const title = body.title === undefined ? row.title : body.title.trim(); const description = body.description === undefined ? row.description : body.description; const start = body.startDate === undefined ? row.start_date : date(body.startDate); const due = body.dueDate === undefined ? row.due_date : date(body.dueDate);
    if (title.length === 0 || title.length > 200 || (description !== null && description.length > 10000)) throw ErrorUtil.unprocessable("Todo content is outside its accepted bounds.");
    validateDates(start?.toISOString(), due?.toISOString());
    const changed = { title: title !== row.title, description: description !== row.description, startDate: !sameDate(start, row.start_date), dueDate: !sameDate(due, row.due_date) };
    if (!changed.title && !changed.description && !changed.startDate && !changed.dueDate) throw ErrorUtil.conflict("The edit does not change Todo content.");
    const now = new Date();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.todo_todos.update({ where: { id }, data: { title, description, start_date: start, due_date: due, updated_at: now } });
      await tx.todo_todo_histories.create({ data: { id: randomUUID(), todo_todo_id: id, created_at: now, title_changed: changed.title, title: changed.title ? title : null, description_changed: changed.description, description: changed.description ? description : null, start_date_changed: changed.startDate, start_date: changed.startDate ? start : null, due_date_changed: changed.dueDate, due_date: changed.dueDate ? due : null } });
      return tx.todo_todos.findUniqueOrThrow({ where: { id } });
    });
    return transform(updated);
  }

  /** Changes completion on an active Todo; repeats are idempotent. */
  export async function complete(actor: AuthProvider.Payload, id: string, body: ITodoCompletion): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: null } });
    if (row === null) throw ErrorUtil.notFound("No such active Todo.");
    if (row.completed === body.completed) return transform(row);
    return transform(await MyGlobal.prisma.todo_todos.update({ where: { id }, data: { completed: body.completed, updated_at: new Date() } }));
  }

  /** Moves one active Todo into trash without changing content or history. */
  export async function trash(actor: AuthProvider.Payload, id: string): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: null } });
    if (row === null) throw ErrorUtil.notFound("No such active Todo.");
    return transform(await MyGlobal.prisma.todo_todos.update({ where: { id }, data: { trashed_at: new Date(), updated_at: new Date() } }));
  }

  /** Restores one trashed Todo to active work. */
  export async function restore(actor: AuthProvider.Payload, id: string): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: { not: null } } });
    if (row === null) throw ErrorUtil.notFound("No such trashed Todo.");
    return transform(await MyGlobal.prisma.todo_todos.update({ where: { id }, data: { trashed_at: null, updated_at: new Date() } }));
  }

  /** Permanently removes one trashed Todo and its histories via cascade. */
  export async function erase(actor: AuthProvider.Payload, id: string): Promise<void> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id, trashed_at: { not: null } }, select: { id: true } });
    if (row === null) throw ErrorUtil.notFound("No such trashed Todo.");
    await MyGlobal.prisma.todo_todos.delete({ where: { id } });
  }

  /** Reads complete immutable history newest first for active or trashed Todos. */
  export async function history(actor: AuthProvider.Payload, id: string): Promise<ITodoHistory[]> {
    const exists = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_account_id: actor.id }, select: { id: true } });
    if (exists === null) throw ErrorUtil.notFound("No such Todo.");
    const rows = await MyGlobal.prisma.todo_todo_histories.findMany({ where: { todo_todo_id: id }, orderBy: [{ created_at: "desc" }, { id: "asc" }] });
    return rows.map((row) => ({ id: row.id, createdAt: row.created_at.toISOString(), ...(row.title_changed ? { title: row.title as string } : {}), ...(row.description_changed ? { description: row.description } : {}), ...(row.start_date_changed ? { startDate: row.start_date?.toISOString() ?? null } : {}), ...(row.due_date_changed ? { dueDate: row.due_date?.toISOString() ?? null } : {}) }));
  }

  function transform(row: { id: string; title: string; description: string | null; start_date: Date | null; due_date: Date | null; completed: boolean; created_at: Date; updated_at: Date; trashed_at: Date | null }): ITodo { return { id: row.id, title: row.title, description: row.description, startDate: row.start_date?.toISOString() ?? null, dueDate: row.due_date?.toISOString() ?? null, completed: row.completed, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(), availability: row.trashed_at === null ? "active" : "trashed", trashedAt: row.trashed_at?.toISOString() ?? null }; }
  function summary(row: { id: string; title: string; start_date: Date | null; due_date: Date | null; completed: boolean; created_at: Date; trashed_at: Date | null }): ITodoSummary { return { id: row.id, title: row.title, completed: row.completed, startDate: row.start_date?.toISOString() ?? null, dueDate: row.due_date?.toISOString() ?? null, createdAt: row.created_at.toISOString(), trashedAt: row.trashed_at?.toISOString() ?? null }; }
  function date(value: string | null | undefined): Date | null { return value === undefined || value === null ? null : new Date(value); }
  function validateDates(start: string | null | undefined, due: string | null | undefined): void { if (start !== undefined && start !== null && due !== undefined && due !== null && new Date(due).getTime() < new Date(start).getTime()) throw ErrorUtil.unprocessable("Due date must not precede start date."); }
  function compareDate(a: Date | null, b: Date | null): number { return (a?.getTime() ?? 0) - (b?.getTime() ?? 0); }
  function compareNullableDate(a: Date | null, b: Date | null): number { if (a === null && b === null) return 0; if (a === null) return 1; if (b === null) return -1; return compareDate(a, b); }
  function sameDate(a: Date | null, b: Date | null): boolean { return a?.getTime() === b?.getTime(); }
}
