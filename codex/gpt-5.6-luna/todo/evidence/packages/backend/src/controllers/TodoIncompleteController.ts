import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo incompletion operation. */
@Controller("todo/user/todo/incomplete-operation")
export class TodoIncompleteController {
  /**
   * Mark one owned active Todo incomplete, idempotently.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Changes only completion state.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Put(":id")
  public async incomplete(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<ITodoTodo> {
    return TodoProvider.incomplete({ user, id });
  }
}
