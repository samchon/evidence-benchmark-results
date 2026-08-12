import type * as api from "@benchmark/todo-api";
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";

import { UserAuth, UserGuard } from "../decorators/UserAuth";
import { type UserPayload } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo operations and the complete content-edit history surface. */
@Controller("todo/user/todo")
@UseGuards(UserGuard)
export class TodoController {
  /**
   * Browse the authenticated owner's active Todos with completion filtering and stable date sorting.
   * Refuses unsupported filters, sort choices, or pagination values.
   *
   * @param input Completion, sort, and page selection
   * @returns One page of compact active Todo summaries
   * @tag Todo
   */
  @TypedRoute.Patch()
  public async index(@UserAuth() user: UserPayload, @TypedBody() input: api.ITodo.IRequest): Promise<api.IPage<api.ITodo.ISummary>> { return TodoProvider.index({ user, input }); }
  /**
   * Create an incomplete active Todo owned permanently by the authenticated user.
   * Refuses invalid content or an incoherent date interval.
   *
   * @param body Todo content and optional planning dates
   * @returns The created Todo detail
   * @tag Todo
   */
  @TypedRoute.Post()
  public async create(@UserAuth() user: UserPayload, @TypedBody() body: api.ITodo.ICreate): Promise<api.ITodo> { return TodoProvider.create({ user, body }); }
  /**
   * View one active Todo owned by the authenticated user.
   * Returns `404` for absent, trashed, or other-owned targets.
   *
   * @param id Active Todo identifier
   * @returns Full active Todo detail
   * @tag Todo
   */
  @TypedRoute.Get(":id")
  public async at(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.at({ user, id }); }
  /**
   * Edit active Todo content and append one immutable history entry atomically.
   * Refuses invalid, no-op, stale, trashed, absent, or other-owned edits.
   *
   * @param id Active Todo identifier
   * @param body Changed content and version read at edit start
   * @returns The updated Todo detail
   * @tag Todo
   */
  @TypedRoute.Put(":id")
  public async update(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">, @TypedBody() body: api.ITodo.IUpdate): Promise<api.ITodo> { return TodoProvider.update({ user, id, body }); }
  /**
   * Mark an owned active Todo complete; repeating the state is idempotent.
   *
   * @param id Active Todo identifier
   * @returns The resulting Todo detail
   * @tag Todo
   */
  @TypedRoute.Put(":id/complete")
  public async complete(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.completion({ user, id, value: "complete" }); }
  /**
   * Mark an owned active Todo incomplete; repeating the state is idempotent.
   *
   * @param id Active Todo identifier
   * @returns The resulting Todo detail
   * @tag Todo
   */
  @TypedRoute.Put(":id/incomplete")
  public async incomplete(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.completion({ user, id, value: "incomplete" }); }
  /**
   * Move an owned active Todo into trash without changing content or history.
   * Refuses an already trashed, absent, or other-owned target.
   *
   * @param id Active Todo identifier
   * @returns The same Todo in trash
   * @tag Trash
   */
  @TypedRoute.Delete(":id")
  public async trash(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.trash({ user, id }); }
  /**
   * View the complete newest-first content-edit history of an owned active or trashed Todo.
   * Completion, trash, and restore transitions never appear as history entries.
   *
   * @param id Owned Todo identifier
   * @returns Immutable content-edit chronology
   * @tag History
   */
  @TypedRoute.Get(":id/history")
  public async history(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodoHistory[]> { return TodoProvider.history({ user, id }); }
}
