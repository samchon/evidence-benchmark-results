import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, ITodoTodo } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Trashed Todo browsing operation. */
@Controller("todo/user/trash/list")
export class TodoTrashIndexController {
  /**
   * Browse retained Todos in most-recently-trashed order.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Lists retained owned Todos.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Patch()
  public async index(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: IPage.IRequest,
  ): Promise<IPage<ITodoTodo.ISummary>> {
    return TodoProvider.trashIndex({ user, body });
  }
}
