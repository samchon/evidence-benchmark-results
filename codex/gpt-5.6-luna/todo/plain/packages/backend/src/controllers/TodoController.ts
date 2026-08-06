import type * as api from "@benchmark/todo-api";
import { Controller } from "@nestjs/common";
import * as core from "@nestia/core";
import { tags } from "typia";
import { UserAuth, type UserPayload } from "../auth/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Active todo operations for the authenticated owner. */
@Controller("todo")
export class TodoController {
  /**
   * Browse the owner's active todos with filter, sort, and pagination.
   * @param actor Authenticated owner whose active collection is queried.
   * @param input Completion filter, supported date sort, and bounded page.
   * @returns One page of compact active todo summaries and totals.
   * @throws 401 when unauthenticated; 422 for unsupported controls.
   * @tag Todo
   */
  @core.TypedRoute.Patch()
  public async index(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.ITodo.IRequest): Promise<api.IPage<api.ITodo.ISummary>> { return TodoProvider.index(actor, input); }

  /**
   * Create one active incomplete todo owned by the caller.
   * @param actor Authenticated owner of the new todo.
   * @param input Required title and independent optional content/date fields.
   * @returns The newly created active todo.
   * @throws 401 when unauthenticated; 422 for invalid content or dates.
   * @tag Todo
   */
  @core.TypedRoute.Post()
  public async create(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.ITodo.ICreate): Promise<api.ITodo> { return TodoProvider.create(actor, input); }

  /**
   * Read one owned active todo.
   * @param actor Authenticated owner of the requested todo.
   * @param id Stable todo identifier.
   * @returns Full active todo content and state.
   * @throws 401 when unauthenticated; 404 when absent, trashed, or foreign.
   * @tag Todo
   */
  @core.TypedRoute.Get(":id")
  public async at(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.at(actor, id, "active"); }

  /**
   * Edit owned active todo content and append one history entry.
   * @param actor Authenticated owner performing the edit.
   * @param id Stable todo identifier.
   * @param input Changed content plus the required revision read before editing.
   * @returns The updated active todo.
   * @throws 401/404 for authority or state failures; 409 for stale revision; 422 for invalid or no-op content.
   * @tag Todo
   */
  @core.TypedRoute.Put(":id")
  public async update(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() input: api.ITodo.IUpdate): Promise<api.ITodo> { return TodoProvider.update(actor, id, input); }

  /**
   * Mark an owned active todo complete, idempotently.
   * @param actor Authenticated owner performing the state command.
   * @param id Stable todo identifier.
   * @returns The active todo with complete status.
   * @throws 401/404 when unauthenticated or not an owned active todo.
   * @tag Todo
   */
  @core.TypedRoute.Put(":id/complete")
  public async complete(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.complete(actor, id, true); }

  /**
   * Mark an owned active todo incomplete, idempotently.
   * @param actor Authenticated owner performing the state command.
   * @param id Stable todo identifier.
   * @returns The active todo with incomplete status.
   * @throws 401/404 when unauthenticated or not an owned active todo.
   * @tag Todo
   */
  @core.TypedRoute.Put(":id/incomplete")
  public async incomplete(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.complete(actor, id, false); }

  /**
   * Move an owned active todo to trash without adding content history.
   * @param actor Authenticated owner performing the soft deletion.
   * @param id Stable todo identifier.
   * @returns The same todo in trashed availability.
   * @throws 401/404 when unauthenticated, foreign, absent, or already trashed.
   * @tag Todo
   */
  @core.TypedRoute.Delete(":id")
  public async erase(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.trash(actor, id); }

  /**
   * Read complete content-edit history for an owned active or trashed todo.
   * @param actor Authenticated owner whose history is read.
   * @param id Stable todo identifier.
   * @returns Immutable history entries newest first.
   * @throws 401/404 when unauthenticated, foreign, or absent.
   * @tag Todo
   */
  @core.TypedRoute.Get(":id/history")
  public async history(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodoHistory[]> { return TodoProvider.history(actor, id); }
}
