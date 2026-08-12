import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo creation operation. */
@Controller("todo/user/todo/create-operation")
export class TodoCreateController {
  /**
   * Create one incomplete active Todo owned by the current account.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Creates an active incomplete Todo.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async create(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: ITodoTodo.ICreate,
  ): Promise<ITodoTodo> {
    return TodoProvider.create({ user, body });
  }
}
