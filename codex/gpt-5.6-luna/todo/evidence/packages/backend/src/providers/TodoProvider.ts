import type { IPage, ITodoTodo } from "@benchmark/todo-api";
import { randomUUID } from "node:crypto";
import type { tags } from "typia";

import { MyGlobal } from "../MyGlobal";
import type { UserPayload } from "../decorators/UserPayload";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Todo business rules, owner visibility, lifecycle transitions, and paging. */
export namespace TodoProvider {
  /** Lists only active Todos owned by the current user. */
  export async function index(props: {
    user: UserPayload;
    body: ITodoTodo.IRequest;
  }): Promise<IPage<ITodoTodo.ISummary>> {
    const page: number = props.body.page ?? 1;
    const limit: number = props.body.limit ?? 20;
    const rows = await MyGlobal.prisma.todo_todos.findMany({
      where: {
        todo_user_id: props.user.id,
        trashed: false,
        completed:
          props.body.completion === "complete-only"
            ? true
            : props.body.completion === "incomplete-only"
              ? false
              : undefined,
      },
      select: selectSummary(),
    });
    const sorted = rows.sort((left, right) => compareRows(left, right, props.body.sort ?? null));
    return pageResult(sorted.map(summary), page, limit);
  }

  /** Creates an incomplete active Todo owned by the authenticated account. */
  export async function create(props: {
    user: UserPayload;
    body: ITodoTodo.ICreate;
  }): Promise<ITodoTodo> {
    const title: string = normalizeTitle(props.body.title);
    const description: string | null = props.body.description ?? null;
    validateDescription(description);
    const startDate: Date | null = parseDate(props.body.startDate ?? null, "start date");
    const dueDate: Date | null = parseDate(props.body.dueDate ?? null, "due date");
    validateDateOrder(startDate, dueDate);
    const row = await MyGlobal.prisma.todo_todos.create({
      data: {
        id: randomUUID(),
        title,
        description,
        start_date: startDate,
        due_date: dueDate,
        completed: false,
        trashed: false,
        created_at: new Date(),
        trashed_at: null,
        content_version: 0,
        updated_at: new Date(),
        user: { connect: { id: props.user.id } },
      },
      select: selectDetail(),
    });
    return detail(row);
  }

  /** Returns one owned active Todo. */
  export async function at(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    const row = await owned(props.user.id, props.id, false);
    return detail(row);
  }

  /** Applies one real, current-version content edit and appends its history row atomically. */
  export async function update(props: {
    user: UserPayload;
    id: string;
    body: ITodoTodo.IUpdate;
  }): Promise<ITodoTodo> {
    const row = await owned(props.user.id, props.id, false);
    if (row.content_version !== props.body.version)
      throw ErrorUtil.conflict("The Todo changed after this edit began.");
    const supplied: boolean =
      props.body.title !== undefined ||
      props.body.description !== undefined ||
      props.body.startDate !== undefined ||
      props.body.dueDate !== undefined;
    if (supplied === false) throw ErrorUtil.unprocessable("At least one content value must be supplied.");
    const title: string =
      props.body.title === undefined
        ? row.title
        : props.body.title === null
          ? invalidTitle()
          : normalizeTitle(props.body.title);
    const description: string | null = props.body.description === undefined ? row.description : props.body.description;
    validateDescription(description);
    const startDate: Date | null = props.body.startDate === undefined ? row.start_date : parseDate(props.body.startDate, "start date");
    const dueDate: Date | null = props.body.dueDate === undefined ? row.due_date : parseDate(props.body.dueDate, "due date");
    validateDateOrder(startDate, dueDate);
    const titleChanged: boolean = props.body.title !== undefined && title !== row.title;
    const descriptionChanged: boolean = props.body.description !== undefined && description !== row.description;
    const startChanged: boolean = props.body.startDate !== undefined && sameDate(startDate, row.start_date) === false;
    const dueChanged: boolean = props.body.dueDate !== undefined && sameDate(dueDate, row.due_date) === false;
    if (titleChanged || descriptionChanged || startChanged || dueChanged) {
      const now: Date = new Date();
      await MyGlobal.prisma.$transaction([
        MyGlobal.prisma.todo_todos.update({
          where: { id: row.id },
          data: {
            title,
            description,
            start_date: startDate,
            due_date: dueDate,
            content_version: { increment: 1 },
            updated_at: now,
          },
        }),
        MyGlobal.prisma.todo_todo_histories.create({
          data: {
            id: randomUUID(),
            created_at: now,
            title: titleChanged ? title : null,
            description: descriptionChanged ? description : null,
            start_date: startChanged ? startDate : null,
            due_date: dueChanged ? dueDate : null,
            description_changed: descriptionChanged,
            start_date_changed: startChanged,
            due_date_changed: dueChanged,
            todo: { connect: { id: row.id } },
          },
        }),
      ]);
    } else throw ErrorUtil.conflict("The edit does not change Todo content.");
    return at(props);
  }

  /** Marks an active Todo complete or returns the same value idempotently. */
  export async function complete(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    return setCompletion(props, true);
  }

  /** Marks an active Todo incomplete or returns the same value idempotently. */
  export async function incomplete(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    return setCompletion(props, false);
  }

  /** Moves an active Todo into retained trash without creating content history. */
  export async function trash(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    const row = await owned(props.user.id, props.id, false);
    const updated = await MyGlobal.prisma.todo_todos.update({
      where: { id: row.id },
      data: { trashed: true, trashed_at: new Date(), updated_at: new Date() },
      select: selectDetail(),
    });
    return detail(updated);
  }

  /** Lists only trashed Todos in stable newest-trash order. */
  export async function trashIndex(props: {
    user: UserPayload;
    body: IPage.IRequest;
  }): Promise<IPage<ITodoTodo.ISummary>> {
    const page: number = props.body.page ?? 1;
    const limit: number = props.body.limit ?? 20;
    const rows = await MyGlobal.prisma.todo_todos.findMany({
      where: { todo_user_id: props.user.id, trashed: true },
      select: selectSummary(),
    });
    rows.sort((left, right) => compareTrash(left, right));
    return pageResult(rows.map(summary), page, limit);
  }

  /** Returns one owned Todo while it remains in trash. */
  export async function trashAt(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    return detail(await owned(props.user.id, props.id, true));
  }

  /** Restores the same trashed Todo to active work. */
  export async function restore(props: { user: UserPayload; id: string }): Promise<ITodoTodo> {
    const row = await owned(props.user.id, props.id, true);
    const updated = await MyGlobal.prisma.todo_todos.update({
      where: { id: row.id },
      data: { trashed: false, trashed_at: null, updated_at: new Date() },
      select: selectDetail(),
    });
    return detail(updated);
  }

  /** Permanently deletes a trashed Todo and its attached history. */
  export async function erase(props: { user: UserPayload; id: string }): Promise<true> {
    const row = await owned(props.user.id, props.id, true);
    await MyGlobal.prisma.todo_todos.delete({ where: { id: row.id } });
    return true;
  }

  async function setCompletion(props: { user: UserPayload; id: string }, completed: boolean): Promise<ITodoTodo> {
    const row = await owned(props.user.id, props.id, false);
    if (row.completed === completed) return detail(row);
    const updated = await MyGlobal.prisma.todo_todos.update({
      where: { id: row.id },
      data: { completed, updated_at: new Date() },
      select: selectDetail(),
    });
    return detail(updated);
  }

  async function owned(userId: string, id: string, trashed: boolean) {
    const row = await MyGlobal.prisma.todo_todos.findFirst({
      where: { id, todo_user_id: userId, trashed },
      select: selectDetail(),
    });
    if (row === null) throw ErrorUtil.notFound("No Todo is available at that state.");
    return row;
  }

  function selectSummary() {
    return {
      id: true,
      title: true,
      completed: true,
      start_date: true,
      due_date: true,
      created_at: true,
      trashed_at: true,
    } as const;
  }

  function selectDetail() {
    return {
      id: true,
      title: true,
      description: true,
      start_date: true,
      due_date: true,
      completed: true,
      trashed: true,
      created_at: true,
      trashed_at: true,
      content_version: true,
      updated_at: true,
    } as const;
  }

  function detail(row: ReturnType<typeof selectDetail> extends never ? never : {
    id: string; title: string; description: string | null; start_date: Date | null;
    due_date: Date | null; completed: boolean; trashed: boolean; created_at: Date;
    trashed_at: Date | null; content_version: number; updated_at: Date;
  }): ITodoTodo {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      startDate: dateOnly(row.start_date),
      dueDate: dateOnly(row.due_date),
      status: row.completed ? "complete" : "incomplete",
      availability: row.trashed ? "trashed" : "active",
      createdAt: row.created_at.toISOString(),
      trashedAt: row.trashed_at?.toISOString() ?? null,
      version: row.content_version,
    };
  }

  function summary(row: {
    id: string; title: string; completed: boolean; start_date: Date | null;
    due_date: Date | null; created_at: Date; trashed_at: Date | null;
  }): ITodoTodo.ISummary {
    return {
      id: row.id,
      title: row.title,
      status: row.completed ? "complete" : "incomplete",
      startDate: dateOnly(row.start_date),
      dueDate: dateOnly(row.due_date),
      createdAt: row.created_at.toISOString(),
      trashedAt: row.trashed_at?.toISOString() ?? null,
    };
  }

  function pageResult<T extends object>(rows: T[], page: number, limit: number): IPage<T> {
    const records: number = rows.length;
    const pages: number = Math.ceil(records / limit);
    return {
      pagination: { current: page, limit, records, pages },
      data: rows.slice((page - 1) * limit, page * limit),
    };
  }

  function compareRows(left: { created_at: Date; start_date: Date | null; due_date: Date | null; id: string }, right: { created_at: Date; start_date: Date | null; due_date: Date | null; id: string }, sort: ITodoTodo.IRequest["sort"]): number {
    const token: string = sort?.[0] ?? "-createdAt";
    const descending: boolean = token.startsWith("-");
    const field: string = token.slice(1);
    const leftDate: Date | null = field === "startDate" ? left.start_date : field === "dueDate" ? left.due_date : left.created_at;
    const rightDate: Date | null = field === "startDate" ? right.start_date : field === "dueDate" ? right.due_date : right.created_at;
    if (leftDate === null || rightDate === null) {
      if (leftDate === null && rightDate !== null) return 1;
      if (leftDate !== null && rightDate === null) return -1;
    }
    const value = leftDate?.getTime() ?? 0;
    const other = rightDate?.getTime() ?? 0;
    if (value !== other) return (value - other) * (descending ? -1 : 1);
    if (left.created_at.getTime() !== right.created_at.getTime()) return right.created_at.getTime() - left.created_at.getTime();
    return left.id.localeCompare(right.id);
  }

  function compareTrash(left: { trashed_at: Date | null; created_at: Date; id: string }, right: { trashed_at: Date | null; created_at: Date; id: string }): number {
    const time: number = left.trashed_at?.getTime() ?? 0;
    const other: number = right.trashed_at?.getTime() ?? 0;
    if (time !== other) return other - time;
    if (left.created_at.getTime() !== right.created_at.getTime()) return right.created_at.getTime() - left.created_at.getTime();
    return left.id.localeCompare(right.id);
  }

  function normalizeTitle(value: string): string {
    const result: string = value.trim();
    if (result.length < 1 || result.length > 200) throw ErrorUtil.unprocessable("Title must contain 1 through 200 characters.");
    return result;
  }

  function invalidTitle(): never {
    throw ErrorUtil.unprocessable("Title is required and cannot be cleared.");
  }

  function validateDescription(value: string | null): void {
    if (value !== null && value.length > 10_000) throw ErrorUtil.unprocessable("Description cannot exceed 10000 characters.");
  }

  function parseDate(value: string | null | undefined, name: string): Date | null {
    if (value === null || value === undefined) return null;
    const result: Date = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(result.getTime())) throw ErrorUtil.unprocessable(`${name} is invalid.`);
    return result;
  }

  function validateDateOrder(start: Date | null, due: Date | null): void {
    if (start !== null && due !== null && due.getTime() < start.getTime()) throw ErrorUtil.unprocessable("Due date cannot be earlier than start date.");
  }

  function sameDate(left: Date | null, right: Date | null): boolean {
    return left?.getTime() === right?.getTime();
  }

  function dateOnly(value: Date | null): null | (string & tags.Format<"date">) {
    return value === null ? null : value.toISOString().slice(0, 10) as string & tags.Format<"date">;
  }
}
