import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo detail operation. */
@Controller("todo/user/todo/detail")
export class TodoAtController {
  /**
   * View one owned active Todo with its complete current content.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Reads one active owned Todo.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Get(":id")
  public async at(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<ITodoTodo> {
    return TodoProvider.at({ user, id });
  }
}
