import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo soft-delete operation. */
@Controller("todo/user/todo/trash")
export class TodoTrashMoveController {
  /**
   * Move one owned active Todo to retained trash without adding history.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Moves the owned Todo into retained trash.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<ITodoTodo> {
    return TodoProvider.trash({ user, id });
  }
}
