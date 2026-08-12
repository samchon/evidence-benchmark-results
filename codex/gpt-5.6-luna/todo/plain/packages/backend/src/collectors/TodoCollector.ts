import type { ITodo } from "@benchmark/todo-api";
import { Prisma } from "@prisma/sdk";
import { randomUUID } from "node:crypto";

import { TodoProvider } from "../providers/TodoProvider";

/** Builds persisted Todo creation values from the public creation DTO. */
export namespace TodoCollector {
  /** Collects one active, incomplete Todo owned by the authenticated user. */
  export function collect(props: { body: ITodo.ICreate; userId: string }): Prisma.todo_todosCreateInput {
    const title = props.body.title.trim();
    const description = props.body.description === undefined || props.body.description === null || props.body.description.length === 0 ? null : props.body.description;
    const startDate = props.body.startDate === undefined || props.body.startDate === null ? null : TodoProvider.dateValue(props.body.startDate);
    const dueDate = props.body.dueDate === undefined || props.body.dueDate === null ? null : TodoProvider.dateValue(props.body.dueDate);
    TodoProvider.validateContent({ title, description, startDate, dueDate });
    return {
      id: randomUUID(),
      title,
      description,
      start_date: startDate,
      due_date: dueDate,
      completion: false,
      availability: true,
      created_at: new Date(),
      updated_at: new Date(),
      content_version: 0,
      user: { connect: { id: props.userId } },
    };
  }
}
