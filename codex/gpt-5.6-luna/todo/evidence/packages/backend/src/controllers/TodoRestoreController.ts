import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Trashed Todo restoration operation. */
@Controller("todo/user/trash/restore")
export class TodoRestoreController {
  /**
   * Restore the same Todo to active work without changing its history.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Restores the retained Todo.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Put(":id")
  public async restore(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<ITodoTodo> {
    return TodoProvider.restore({ user, id });
  }
}
