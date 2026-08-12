import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Trashed Todo detail operation. */
@Controller("todo/user/trash/detail")
export class TodoTrashAtController {
  /**
   * Inspect one owned Todo while it is retained in trash.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-2-view-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Reads one retained owned Todo.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<ITodoTodo> {
    return TodoProvider.trashAt({ user, id });
  }
}
