import type * as api from "@benchmark/todo-api";
import { Controller } from "@nestjs/common";
import * as core from "@nestia/core";
import { tags } from "typia";
import { UserAuth, type UserPayload } from "../auth/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Retained todo recovery operations. */
@Controller("trash")
export class TrashController {
  /**
   * Browse the owner's trashed todos newest-deleted first.
   * @param actor Authenticated owner whose trash is queried.
   * @param input Bounded one-based page controls.
   * @returns One page of trashed summaries with trash-entry times and totals.
   * @throws 401 when unauthenticated; 422 for invalid pagination.
   * @tag Trash
   */
  @core.TypedRoute.Patch()
  public async index(@UserAuth() actor: UserPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITodo.ITrashSummary>> { return TodoProvider.trashIndex(actor, input); }

  /**
   * Read one owned trashed todo.
   * @param actor Authenticated owner inspecting retained content.
   * @param id Stable todo identifier.
   * @returns Full preserved todo content, trash time, and trashed state.
   * @throws 401/404 when unauthenticated, active, foreign, or absent.
   * @tag Trash
   */
  @core.TypedRoute.Get(":id")
  public async at(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.at(actor, id, "trashed"); }

  /**
   * Restore one owned trashed todo to active work.
   * @param actor Authenticated owner performing restoration.
   * @param id Stable todo identifier.
   * @returns The same todo in active availability.
   * @throws 401/404 when unauthenticated, active, foreign, or absent.
   * @tag Trash
   */
  @core.TypedRoute.Put(":id/restore")
  public async restore(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.restore(actor, id); }

  /**
   * Permanently delete one owned trashed todo and its history.
   * @param actor Authenticated owner confirming terminal removal.
   * @param id Stable todo identifier.
   * @returns A success marker after cascading todo deletion commits.
   * @throws 401/404 when unauthenticated, active, foreign, or absent.
   * @tag Trash
   */
  @core.TypedRoute.Delete(":id")
  public async erase(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<{ success: true }> { return TodoProvider.permanentDelete(actor, id); }

  /**
   * Read complete content-edit history for one trashed todo.
   * @param actor Authenticated owner whose retained history is read.
   * @param id Stable todo identifier.
   * @returns Immutable history entries newest first.
   * @throws 401/404 when unauthenticated, foreign, or absent.
   * @tag Trash
   */
  @core.TypedRoute.Get(":id/history")
  public async history(@UserAuth() actor: UserPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodoHistory[]> { return TodoProvider.history(actor, id); }
}
