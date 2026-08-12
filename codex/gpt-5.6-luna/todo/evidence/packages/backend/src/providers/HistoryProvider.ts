import type { ITodoTodoHistory } from "@benchmark/todo-api";
import type { tags } from "typia";

import { MyGlobal } from "../MyGlobal";
import type { UserPayload } from "../decorators/UserPayload";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owner-scoped immutable Todo content-history inspection. */
export namespace HistoryProvider {
  /** Returns every content-edit entry newest first for an active or trashed Todo. */
  export async function index(props: {
    user: UserPayload;
    todoId: string;
  }): Promise<ITodoTodoHistory[]> {
    const todo = await MyGlobal.prisma.todo_todos.findFirst({
      where: { id: props.todoId, todo_user_id: props.user.id },
      select: { id: true },
    });
    if (todo === null) throw ErrorUtil.notFound("No Todo is available for this history.");
    const rows = await MyGlobal.prisma.todo_todo_histories.findMany({
      where: { todo_todo_id: todo.id },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        created_at: true,
        title: true,
        description: true,
        start_date: true,
        due_date: true,
        description_changed: true,
        start_date_changed: true,
        due_date_changed: true,
      },
    });
    return rows.map((row) => ({
      id: row.id,
      createdAt: row.created_at.toISOString(),
      ...(row.title === null ? {} : { title: row.title }),
      ...(row.description_changed ? { description: row.description } : {}),
      ...(row.start_date_changed ? { startDate: row.start_date === null ? null : row.start_date.toISOString().slice(0, 10) as string & tags.Format<"date"> } : {}),
      ...(row.due_date_changed ? { dueDate: row.due_date === null ? null : row.due_date.toISOString().slice(0, 10) as string & tags.Format<"date"> } : {}),
    }));
  }
}
