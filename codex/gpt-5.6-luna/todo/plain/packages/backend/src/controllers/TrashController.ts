import type * as api from "@benchmark/todo-api";
import { TypedBody, TypedParam, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";

import { UserAuth, UserGuard } from "../decorators/UserAuth";
import { type UserPayload } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Owner-scoped trash browsing and recovery operations. */
@Controller("todo/user/trash")
@UseGuards(UserGuard)
export class TrashController {
  /**
   * Browse the authenticated owner's retained Todos newest-trash-first.
   * Refuses unsupported pagination values and excludes active or other-owned Todos.
   *
   * @param input Page selection
   * @returns One page of compact trashed Todo summaries
   * @tag Trash
   */
  @TypedRoute.Patch()
  public async index(@UserAuth() user: UserPayload, @TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ITodo.ITrashSummary>> { return TodoProvider.trashIndex({ user, input }); }
  /**
   * Inspect one owned trashed Todo before recovery or permanent deletion.
   * Returns `404` for active, absent, or other-owned targets.
   *
   * @param id Trashed Todo identifier
   * @returns Preserved full Todo detail
   * @tag Trash
   */
  @TypedRoute.Get(":id")
  public async at(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.trashAt({ user, id }); }
  /**
   * Restore the same Todo identity to active work without adding history.
   * Refuses an active, absent, or other-owned target.
   *
   * @param id Trashed Todo identifier
   * @returns The restored active Todo
   * @tag Trash
   */
  @TypedRoute.Put(":id/restore")
  public async restore(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ITodo> { return TodoProvider.restore({ user, id }); }
  /**
   * Permanently delete one trashed Todo and every attached history entry.
   * Refuses an active, absent, or other-owned target.
   *
   * @param id Trashed Todo identifier
   * @returns A successful acknowledgement
   * @tag Trash
   */
  @TypedRoute.Delete(":id")
  public async erase(@UserAuth() user: UserPayload, @TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IOperationResult> { return TodoProvider.erase({ user, id }); }
}
