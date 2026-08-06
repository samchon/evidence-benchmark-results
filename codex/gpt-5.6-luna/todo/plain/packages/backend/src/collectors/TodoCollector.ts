import type { IEntity } from "@benchmark/todo-api";
import type { Prisma } from "@prisma/sdk";
import { randomUUID } from "node:crypto";

/** Owns request-to-Prisma write payloads for todo content. */
export namespace TodoCollector {
  export function create(props: {
    owner: IEntity;
    title: string;
    description: string | null;
    startDate: Date | null;
    dueDate: Date | null;
    now: Date;
  }) {
    return {
      id: randomUUID(),
      title: props.title,
      description: props.description,
      start_date: props.startDate,
      due_date: props.dueDate,
      completed: false,
      trashed: false,
      trashed_at: null,
      created_at: props.now,
      updated_at: props.now,
      account: { connect: { id: props.owner.id } },
    } satisfies Prisma.user_todosCreateInput;
  }

  export function edit(props: {
    title: string;
    description: string | null;
    startDate: Date | null;
    dueDate: Date | null;
    updatedAt: Date;
  }) {
    return {
      title: props.title,
      description: props.description,
      start_date: props.startDate,
      due_date: props.dueDate,
      updated_at: props.updatedAt,
    };
  }
}
