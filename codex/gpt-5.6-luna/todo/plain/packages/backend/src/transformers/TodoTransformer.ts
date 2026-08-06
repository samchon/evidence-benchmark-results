import type { ITodo, ITodoHistory } from "@benchmark/todo-api";

/** Selected todo row fields consumed by public todo detail projections. */
export interface TodoRow {
  id: string;
  title: string;
  description: string | null;
  start_date: Date | null;
  due_date: Date | null;
  completed: boolean;
  trashed: boolean;
  trashed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/** Selected todo row fields consumed by list projections. */
export interface TodoSummaryRow {
  id: string;
  title: string;
  start_date: Date | null;
  due_date: Date | null;
  completed: boolean;
  created_at: Date;
  trashed_at?: Date | null;
}

/** Selected history row fields consumed by history projections. */
export interface TodoHistoryRow {
  id: string;
  edited_at: Date;
  title: string | null;
  description: string | null;
  start_date: Date | null;
  due_date: Date | null;
  description_changed: boolean;
  start_date_changed: boolean;
  due_date_changed: boolean;
}

/** Owns Prisma-to-API projections for todo resources. */
export namespace TodoTransformer {
  export function isoDate(value: Date | null): string | null {
    return value === null ? null : value.toISOString().slice(0, 10);
  }

  export function detail(row: TodoRow): ITodo {
    return {
      id: row.id as ITodo["id"],
      title: row.title,
      description: row.description,
      startDate: isoDate(row.start_date) as ITodo["startDate"],
      dueDate: isoDate(row.due_date) as ITodo["dueDate"],
      status: row.completed ? "complete" : "incomplete",
      availability: row.trashed ? "trashed" : "active",
      createdAt: row.created_at.toISOString() as ITodo["createdAt"],
      trashedAt: row.trashed_at?.toISOString() ?? null,
      updatedAt: row.updated_at.toISOString() as ITodo["updatedAt"],
    };
  }

  export function summary(row: TodoSummaryRow, includeTrash: boolean = false): ITodo.ISummary | ITodo.ITrashSummary {
    return {
      id: row.id as ITodo.ISummary["id"],
      title: row.title,
      startDate: isoDate(row.start_date) as ITodo.ISummary["startDate"],
      dueDate: isoDate(row.due_date) as ITodo.ISummary["dueDate"],
      status: row.completed ? "complete" : "incomplete",
      createdAt: row.created_at.toISOString() as ITodo.ISummary["createdAt"],
      ...(includeTrash ? { trashedAt: row.trashed_at?.toISOString() } : {}),
    } as ITodo.ISummary | ITodo.ITrashSummary;
  }

  export function history(row: TodoHistoryRow): ITodoHistory {
    return {
      id: row.id as ITodoHistory["id"],
      editedAt: row.edited_at.toISOString() as ITodoHistory["editedAt"],
      ...(row.title === null ? {} : { title: row.title }),
      ...(row.description_changed ? { description: row.description } : {}),
      ...(row.start_date_changed ? { startDate: isoDate(row.start_date) } : {}),
      ...(row.due_date_changed ? { dueDate: isoDate(row.due_date) } : {}),
    };
  }
}
