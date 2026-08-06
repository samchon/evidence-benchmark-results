import type { IPage, ITodo, ITodoHistory, IResult } from "@benchmark/todo-api";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { UserPayload } from "../auth/AuthProvider";
import { randomUUID } from "node:crypto";
import { TodoTransformer } from "../transformers/TodoTransformer";
import { TodoCollector } from "../collectors/TodoCollector";
import { PaginationUtil } from "../utils/PaginationUtil";

function dateOnly(value: string | null | undefined): Date | null {
  if (value === null || value === undefined) return null;
  const [year = Number.NaN, month = Number.NaN, day = Number.NaN] = value.split("-").map(Number);
  const result = new Date(Date.UTC(year, month - 1, day));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || result.getUTCFullYear() !== year || result.getUTCMonth() !== month - 1 || result.getUTCDate() !== day)
    throw ErrorUtil.unprocessable("Dates must be valid calendar dates.");
  return result;
}
function validateContent(title: string, description: string | null, start: string | null, due: string | null): void {
  const trimmed = title.trim();
  if (trimmed.length < 1 || trimmed.length > 200) throw ErrorUtil.unprocessable("Title must contain 1 through 200 characters after trimming.");
  if (description !== null && description.length > 10_000) throw ErrorUtil.unprocessable("Description must contain at most 10000 characters.");
  if ((start !== null && !/^\d{4}-\d{2}-\d{2}$/.test(start)) || (due !== null && !/^\d{4}-\d{2}-\d{2}$/.test(due))) throw ErrorUtil.unprocessable("Dates must use the YYYY-MM-DD calendar format.");
  if (start !== null) dateOnly(start);
  if (due !== null) dateOnly(due);
  if (start !== null && due !== null && due < start) throw ErrorUtil.unprocessable("Due date must be on or after the start date.");
}
async function owned(actor: UserPayload, id: string, trashed: boolean | null = null) {
  const row = await MyGlobal.prisma.user_todos.findFirst({ where: { id, user_account_id: actor.id, ...(trashed === null ? {} : { trashed }) } });
  if (row === null) throw ErrorUtil.notFound("Todo not found.");
  return row;
}

/** Todo content, state, browsing, and history behavior. */
export namespace TodoProvider {
  export async function create(actor: UserPayload, input: ITodo.ICreate): Promise<ITodo> {
    const title = input.title.trim();
    const description = input.description === undefined ? null : input.description;
    const startDate = input.startDate === undefined ? null : input.startDate;
    const dueDate = input.dueDate === undefined ? null : input.dueDate;
    validateContent(title, description, startDate, dueDate);
    const now = new Date();
    const row = await MyGlobal.prisma.user_todos.create({ data: TodoCollector.create({ owner: { id: actor.id }, title, description, startDate: dateOnly(startDate), dueDate: dateOnly(dueDate), now }) });
    return TodoTransformer.detail(row);
  }
  export async function index(actor: UserPayload, input: ITodo.IRequest): Promise<IPage<ITodo.ISummary>> {
    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    if (page < 1 || limit < 1 || limit > 100) throw ErrorUtil.unprocessable("Page must be at least 1 and limit must be from 1 through 100.");
    const filter = input.filter ?? "all";
    if (!["all", "complete-only", "incomplete-only"].includes(filter)) throw ErrorUtil.unprocessable("Unsupported completion filter.");
    const sort = input.sort ?? "createdAt";
    const direction = input.direction ?? (sort === "createdAt" ? "desc" : "asc");
    if (!["createdAt", "startDate", "dueDate"].includes(sort) || !["asc", "desc"].includes(direction)) throw ErrorUtil.unprocessable("Unsupported sort selection.");
    const rows = await MyGlobal.prisma.user_todos.findMany({ where: { user_account_id: actor.id, trashed: false } });
    const candidates = rows.filter((row) => filter === "all" || (filter === "complete-only" ? row.completed : !row.completed));
    candidates.sort((a, b) => {
      const av = sort === "createdAt" ? a.created_at.getTime() : sort === "startDate" ? a.start_date?.getTime() : a.due_date?.getTime();
      const bv = sort === "createdAt" ? b.created_at.getTime() : sort === "startDate" ? b.start_date?.getTime() : b.due_date?.getTime();
      let compared: number;
      if (av === undefined && bv === undefined) compared = 0; else if (av === undefined) compared = 1; else if (bv === undefined) compared = -1; else compared = av - bv;
      if (direction === "desc" && av !== undefined && bv !== undefined) compared = -compared;
      if (compared !== 0) return compared;
      const created = b.created_at.getTime() - a.created_at.getTime();
      return created !== 0 ? created : a.id.localeCompare(b.id);
    });
    const start = (page - 1) * limit;
    return { data: candidates.slice(start, start + limit).map((row) => TodoTransformer.summary(row)), pagination: { current: page, limit, records: candidates.length, pages: Math.ceil(candidates.length / limit) } };
  }
  export async function trashIndex(actor: UserPayload, input: IPage.IRequest): Promise<IPage<ITodo.ITrashSummary>> {
    return PaginationUtil.paginate({
      schema: MyGlobal.prisma.user_todos,
      payload: {},
      transform: (row) => {
        if (row.trashed_at === null)
          throw ErrorUtil.internal("Trashed todo is missing its trash timestamp.");
        return TodoTransformer.summary(row, true) as ITodo.ITrashSummary;
      },
    })({
      where: { user_account_id: actor.id, trashed: true },
      orderBy: [{ trashed_at: "desc" }, { created_at: "desc" }, { id: "asc" }],
    })(input);
  }
  export async function at(actor: UserPayload, id: string, state: "active" | "trashed"): Promise<ITodo> { return TodoTransformer.detail(await owned(actor, id, state === "trashed")); }
  export async function update(actor: UserPayload, id: string, input: ITodo.IUpdate): Promise<ITodo> {
    const current = await owned(actor, id, false);
    if (input.updatedAt !== current.updated_at.toISOString()) throw ErrorUtil.conflict("Todo changed after editing began.");
    const title = input.title === undefined ? current.title : input.title.trim();
    const description = input.description === undefined ? current.description : input.description;
    const start = input.startDate === undefined ? TodoTransformer.isoDate(current.start_date) : input.startDate;
    const due = input.dueDate === undefined ? TodoTransformer.isoDate(current.due_date) : input.dueDate;
    validateContent(title, description, start, due);
    const changedTitle = input.title !== undefined && title !== current.title;
    const changedDescription = input.description !== undefined && description !== current.description;
    const changedStart = input.startDate !== undefined && start !== TodoTransformer.isoDate(current.start_date);
    const changedDue = input.dueDate !== undefined && due !== TodoTransformer.isoDate(current.due_date);
    if (!changedTitle && !changedDescription && !changedStart && !changedDue) throw ErrorUtil.unprocessable("Content edit must change at least one field.");
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      const changed = await tx.user_todos.updateMany({ where: { id: current.id, updated_at: current.updated_at }, data: TodoCollector.edit({ title, description, startDate: dateOnly(start), dueDate: dateOnly(due), updatedAt: now }) });
      if (changed.count !== 1) throw ErrorUtil.conflict("Todo changed after editing began.");
      await tx.user_todo_histories.create({ data: { id: randomUUID(), user_todo_id: current.id, edited_at: now, title: changedTitle ? title : null, description: changedDescription ? description : null, start_date: changedStart ? dateOnly(start) : null, due_date: changedDue ? dateOnly(due) : null, description_changed: changedDescription, start_date_changed: changedStart, due_date_changed: changedDue } });
    });
    return TodoTransformer.detail(await owned(actor, id, false));
  }
  export async function complete(actor: UserPayload, id: string, completed: boolean): Promise<ITodo> {
    const current = await owned(actor, id, false);
    if (current.completed === completed) return TodoTransformer.detail(current);
    await MyGlobal.prisma.user_todos.updateMany({ where: { id, user_account_id: actor.id, trashed: false, completed: !completed }, data: { completed } });
    return TodoTransformer.detail(await owned(actor, id, false));
  }
  export async function trash(actor: UserPayload, id: string): Promise<ITodo> {
    await owned(actor, id, false);
    const now = new Date();
    const changed = await MyGlobal.prisma.user_todos.updateMany({ where: { id, user_account_id: actor.id, trashed: false }, data: { trashed: true, trashed_at: now } });
    if (changed.count !== 1) throw ErrorUtil.notFound("Todo not found.");
    return TodoTransformer.detail(await owned(actor, id, true));
  }
  export async function restore(actor: UserPayload, id: string): Promise<ITodo> {
    await owned(actor, id, true);
    const changed = await MyGlobal.prisma.user_todos.updateMany({ where: { id, user_account_id: actor.id, trashed: true }, data: { trashed: false, trashed_at: null } });
    if (changed.count !== 1) throw ErrorUtil.notFound("Todo not found.");
    return TodoTransformer.detail(await owned(actor, id, false));
  }
  export async function permanentDelete(actor: UserPayload, id: string): Promise<IResult> {
    await owned(actor, id, true);
    const changed = await MyGlobal.prisma.user_todos.deleteMany({ where: { id, user_account_id: actor.id, trashed: true } });
    if (changed.count !== 1) throw ErrorUtil.notFound("Todo not found.");
    return { success: true };
  }
  export async function history(actor: UserPayload, id: string): Promise<ITodoHistory[]> {
    await owned(actor, id, null);
    const rows = await MyGlobal.prisma.user_todo_histories.findMany({ where: { user_todo_id: id }, orderBy: [{ edited_at: "desc" }, { id: "desc" }] });
    return rows.map(TodoTransformer.history);
  }
}
