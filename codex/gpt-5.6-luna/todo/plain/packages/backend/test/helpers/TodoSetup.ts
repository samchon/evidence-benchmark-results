import * as api from "@benchmark/todo-api";
import { randomUUID } from "node:crypto";

import { MyGlobal } from "../../src/MyGlobal";

/** One authenticated test account and its connection. */
export interface IUserSetup {
  connection: api.IConnection;
  email: string;
  password: string;
  authorized: api.IUser.IAuthorized;
}

/** Registers a unique account through the public join operation. */
export async function joinUser(base: api.IConnection): Promise<IUserSetup> {
  const connection: api.IConnection = { host: base.host };
  const email = `user-${randomUUID()}@example.com`;
  const password = "correct horse battery staple";
  const authorized = await api.functional.todo.auth.user.join(connection, {
    email,
    password,
    displayName: "Private Owner",
  });
  return { connection, email, password, authorized };
}

/** Creates one Todo through the public creation operation. */
export async function createTodo(connection: api.IConnection, input?: Partial<api.ITodo.ICreate>): Promise<api.ITodo> {
  return api.functional.todo.user.todo.create(connection, {
    title: input?.title ?? "Prepare the release",
    description: input?.description,
    startDate: input?.startDate,
    dueDate: input?.dueDate,
  });
}

/** Reads the proof recorded for a test-only local delivery effect. */
export async function recoveryProof(email: string): Promise<string> {
  const effect = await MyGlobal.prisma.todo_delivery_effects.findFirst({
    where: { recipient: email, kind: "password-recovery" },
    orderBy: [{ created_at: "desc" }, { id: "asc" }],
  });
  if (effect === null) throw new Error("The recovery delivery effect was not recorded.");
  const payload = JSON.parse(effect.payload) as { proof?: unknown };
  if (typeof payload.proof !== "string") throw new Error("The recovery delivery effect has no proof.");
  return payload.proof;
}
