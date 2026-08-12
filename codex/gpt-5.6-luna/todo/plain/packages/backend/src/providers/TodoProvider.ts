import type { ITodo, ITodoHistory, IPage } from "@benchmark/todo-api";
import { Prisma } from "@prisma/sdk";
import { randomUUID } from "node:crypto";

import { TodoCollector } from "../collectors/TodoCollector";
import { UserPayload } from "./AuthProvider";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

type TodoRow = Prisma.todo_todosGetPayload<ReturnType<typeof todoSelect>>;
type HistoryRow = Prisma.todo_todo_historiesGetPayload<ReturnType<typeof historySelect>>;

function todoSelect() { return { select: { id: true, title: true, description: true, start_date: true, due_date: true, completion: true, availability: true, created_at: true, updated_at: true, content_version: true, trashed_at: true } } satisfies Prisma.todo_todosFindManyArgs; }
function historySelect() { return { select: { id: true, created_at: true, title_changed: true, title: true, description_changed: true, description: true, start_date_changed: true, start_date: true, due_date_changed: true, due_date: true } } satisfies Prisma.todo_todo_historiesFindManyArgs; }

/** Todo content, lifecycle, pagination, ownership, and history rules. */
export namespace TodoProvider {
  /** Lists owned active todos with completion and stable date ordering. */
  export async function index(props: { user: UserPayload; input: ITodo.IRequest }): Promise<IPage<ITodo.ISummary>> {
    const completion = props.input.completion ?? "all";
    if (!["all", "complete-only", "incomplete-only"].includes(completion)) throw ErrorUtil.unprocessable("Unsupported completion filter.");
    const sort = props.input.sort ?? "created-desc";
    if (!["created-desc", "created-asc", "start-asc", "start-desc", "due-asc", "due-desc"].includes(sort)) throw ErrorUtil.unprocessable("Unsupported Todo sort.");
    const where = { todo_user_id: props.user.id, availability: true, ...(completion === "all" ? {} : { completion: completion === "complete-only" }) };
    const [records, rows] = await Promise.all([
      MyGlobal.prisma.todo_todos.count({ where }),
      MyGlobal.prisma.todo_todos.findMany({ where, ...todoSelect(), skip: offset(props.input), take: limit(props.input), orderBy: ordering(sort) }),
    ]);
    return page(rows.map(summary), records, props.input);
  }

  /** Creates one active incomplete Todo and returns its persisted detail. */
  export async function create(props: { user: UserPayload; body: ITodo.ICreate }): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.create({ data: TodoCollector.collect({ body: props.body, userId: props.user.id }), ...todoSelect() });
    return detail(row);
  }

  /** Reads one owned active Todo. */
  export async function at(props: { user: UserPayload; id: string }): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id: props.id, todo_user_id: props.user.id, availability: true }, ...todoSelect() });
    if (row === null) throw ErrorUtil.notFound("The active Todo is unavailable.");
    return detail(row);
  }

  /** Applies an optimistic content edit and appends exactly one history row. */
  export async function update(props: { user: UserPayload; id: string; body: ITodo.IUpdate }): Promise<ITodo> {
    const row = await owned(props.user, props.id, "active");
    if (row.content_version !== props.body.version) throw ErrorUtil.conflict("The Todo changed after this edit began.");
    const title = props.body.title === undefined ? row.title : props.body.title.trim();
    const description = props.body.description === undefined ? row.description : props.body.description === null || props.body.description.length === 0 ? null : props.body.description;
    const startDate = props.body.startDate === undefined ? row.start_date : props.body.startDate === null ? null : dateValue(props.body.startDate);
    const dueDate = props.body.dueDate === undefined ? row.due_date : props.body.dueDate === null ? null : dateValue(props.body.dueDate);
    validateContent({ title, description, startDate, dueDate });
    const titleChanged = props.body.title !== undefined && title !== row.title;
    const descriptionChanged = props.body.description !== undefined && description !== row.description;
    const startChanged = props.body.startDate !== undefined && !sameDate(startDate, row.start_date);
    const dueChanged = props.body.dueDate !== undefined && !sameDate(dueDate, row.due_date);
    if (!titleChanged && !descriptionChanged && !startChanged && !dueChanged) throw ErrorUtil.unprocessable("At least one Todo content value must change.");
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.todo_todos.updateMany({ where: { id: row.id, todo_user_id: props.user.id, availability: true, content_version: row.content_version }, data: { title, description, start_date: startDate, due_date: dueDate, updated_at: now, content_version: { increment: 1 } } });
      if (changed.count !== 1) throw ErrorUtil.conflict("The Todo changed after this edit began.");
      await tx.todo_todo_histories.create({ data: { id: randomUUID(), todo_todo_id: row.id, created_at: now, title_changed: titleChanged, title: titleChanged ? title : null, description_changed: descriptionChanged, description: descriptionChanged ? description : null, start_date_changed: startChanged, start_date: startChanged ? startDate : null, due_date_changed: dueChanged, due_date: dueChanged ? dueDate : null } });
    });
    return at(props);
  }

  /** Idempotently marks one owned active Todo complete or incomplete. */
  export async function completion(props: { user: UserPayload; id: string; value: "complete" | "incomplete" }): Promise<ITodo> {
    const row = await owned(props.user, props.id, "active");
    if (completionState(row.completion) !== props.value) {
      const changed = await MyGlobal.prisma.todo_todos.updateMany({ where: { id: row.id, todo_user_id: props.user.id, availability: true }, data: { completion: props.value === "complete", updated_at: new Date() } });
      if (changed.count !== 1) throw ErrorUtil.notFound("The active Todo is unavailable.");
    }
    return at(props);
  }

  /** Moves one active Todo into trash without changing content or history. */
  export async function trash(props: { user: UserPayload; id: string }): Promise<ITodo> {
    const row = await owned(props.user, props.id, "active");
    const now = new Date();
    const changed = await MyGlobal.prisma.todo_todos.updateMany({ where: { id: row.id, todo_user_id: props.user.id, availability: true }, data: { availability: false, trashed_at: now, updated_at: now } });
    if (changed.count !== 1) throw ErrorUtil.notFound("The active Todo is unavailable.");
    return trashAt(props);
  }

  /** Lists owned trashed Todos in newest-trash-entry order. */
  export async function trashIndex(props: { user: UserPayload; input: IPage.IRequest }): Promise<IPage<ITodo.ITrashSummary>> {
    const where = { todo_user_id: props.user.id, availability: false };
    const [records, rows] = await Promise.all([
      MyGlobal.prisma.todo_todos.count({ where }),
      MyGlobal.prisma.todo_todos.findMany({ where, ...todoSelect(), skip: offset(props.input), take: limit(props.input), orderBy: ordering("trash-desc") }),
    ]);
    return page(rows.map(trashSummary), records, props.input);
  }

  /** Reads one owned Todo retained in trash. */
  export async function trashAt(props: { user: UserPayload; id: string }): Promise<ITodo> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id: props.id, todo_user_id: props.user.id, availability: false }, ...todoSelect() });
    if (row === null) throw ErrorUtil.notFound("The trashed Todo is unavailable.");
    return detail(row);
  }

  /** Restores the same Todo identity to active work. */
  export async function restore(props: { user: UserPayload; id: string }): Promise<ITodo> {
    const row = await owned(props.user, props.id, "trashed");
    const changed = await MyGlobal.prisma.todo_todos.updateMany({ where: { id: row.id, todo_user_id: props.user.id, availability: false }, data: { availability: true, updated_at: new Date() } });
    if (changed.count !== 1) throw ErrorUtil.notFound("The trashed Todo is unavailable.");
    return at(props);
  }

  /** Permanently deletes one trashed Todo and its histories by cascade. */
  export async function erase(props: { user: UserPayload; id: string }): Promise<{ success: true }> {
    const row = await owned(props.user, props.id, "trashed");
    const deleted = await MyGlobal.prisma.todo_todos.deleteMany({ where: { id: row.id, todo_user_id: props.user.id, availability: false } });
    if (deleted.count !== 1) throw ErrorUtil.notFound("The trashed Todo is unavailable.");
    return { success: true };
  }

  /** Reads complete owned history in newest-first order for active or trashed state. */
  export async function history(props: { user: UserPayload; id: string }): Promise<ITodoHistory[]> {
    const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id: props.id, todo_user_id: props.user.id }, select: { id: true } });
    if (row === null) throw ErrorUtil.notFound("The Todo is unavailable.");
    const rows = await MyGlobal.prisma.todo_todo_histories.findMany({ where: { todo_todo_id: row.id }, ...historySelect(), orderBy: [{ created_at: "desc" }, { id: "asc" }] });
    return rows.map(historyDetail);
  }

  /** Converts a date-only wire value to a UTC-midnight database value. */
  export function dateValue(value: string): Date { const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value); if (match === null) throw ErrorUtil.unprocessable("Dates must use YYYY-MM-DD."); const year = Number(match[1]); const month = Number(match[2]); const day = Number(match[3]); const result = new Date(0); result.setUTCHours(0, 0, 0, 0); result.setUTCFullYear(year, month - 1, day); if (result.getUTCFullYear() !== year || result.getUTCMonth() !== month - 1 || result.getUTCDate() !== day) throw ErrorUtil.unprocessable("Dates must be real calendar dates."); return result; }
  /** Validates the resulting Todo content and date interval. */
  export function validateContent(props: { title: string; description: string | null; startDate: Date | null; dueDate: Date | null }): void { if (props.title.length < 1 || props.title.length > 200) throw ErrorUtil.unprocessable("title must contain 1 to 200 characters after trimming."); if (props.description !== null && props.description.length > 10_000) throw ErrorUtil.unprocessable("description must contain at most 10000 characters."); if (props.startDate !== null && props.dueDate !== null && props.dueDate < props.startDate) throw ErrorUtil.unprocessable("dueDate must not precede startDate."); }

  async function owned(user: UserPayload, id: string, availability: "active" | "trashed"): Promise<TodoRow> { const row = await MyGlobal.prisma.todo_todos.findFirst({ where: { id, todo_user_id: user.id, availability: availability === "active" }, ...todoSelect() }); if (row === null) throw ErrorUtil.notFound("The Todo is unavailable."); return row; }
  function detail(row: TodoRow): ITodo { return { ...summary(row), description: row.description, availability: state(row.availability), trashedAt: row.trashed_at?.toISOString() ?? null, version: row.content_version }; }
  function summary(row: TodoRow): ITodo.ISummary { return { id: row.id, title: row.title, completion: completionState(row.completion), startDate: dateText(row.start_date), dueDate: dateText(row.due_date), createdAt: row.created_at.toISOString() }; }
  function trashSummary(row: TodoRow): ITodo.ITrashSummary { return { ...summary(row), trashedAt: row.trashed_at?.toISOString() ?? null }; }
  function historyDetail(row: HistoryRow): ITodoHistory { return { id: row.id, createdAt: row.created_at.toISOString(), ...(row.title_changed ? { title: row.title ?? "" } : {}), ...(row.description_changed ? { description: row.description } : {}), ...(row.start_date_changed ? { startDate: dateText(row.start_date) } : {}), ...(row.due_date_changed ? { dueDate: dateText(row.due_date) } : {}) }; }
  function state(value: boolean): "active" | "trashed" { return value ? "active" : "trashed"; }
  function completionState(value: boolean): "incomplete" | "complete" { return value ? "complete" : "incomplete"; }
  function dateText(value: Date | null): string | null { return value === null ? null : value.toISOString().slice(0, 10); }
  function sameDate(left: Date | null, right: Date | null): boolean { return left?.getTime() === right?.getTime(); }
  function limit(input: IPage.IRequest): number { return input.limit ?? 20; }
  function offset(input: IPage.IRequest): number { return ((input.page ?? 1) - 1) * limit(input); }
  function page<T extends object>(data: T[], records: number, input: IPage.IRequest): IPage<T> { const current = input.page ?? 1; const size = limit(input); return { data, pagination: { current, limit: size, records, pages: Math.ceil(records / size) } }; }
  function ordering(sort: string): Prisma.todo_todosOrderByWithRelationInput[] {
    if (sort === "start-asc" || sort === "start-desc")
      return [{ start_date: { sort: sort.endsWith("asc") ? "asc" : "desc", nulls: "last" } }, { created_at: "desc" }, { id: "asc" }];
    if (sort === "due-asc" || sort === "due-desc")
      return [{ due_date: { sort: sort.endsWith("asc") ? "asc" : "desc", nulls: "last" } }, { created_at: "desc" }, { id: "asc" }];
    if (sort === "trash-desc")
      return [{ trashed_at: { sort: "desc", nulls: "last" } }, { created_at: "desc" }, { id: "asc" }];
    return [{ created_at: sort === "created-asc" ? "asc" : "desc" }, { id: "asc" }];
  }
}
