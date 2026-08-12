import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IPage, ITodoTodo } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo browsing operation. */
@Controller("todo/user/todo/list")
export class TodoIndexController {
  /**
   * Browse the current user's active Todos with completion and date controls.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Delegates supported creation, start-date, and due-date ordering for the active owned list.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Read the sorting table, inspected TodoProvider.compareRows, and ran test_api_todo_index to check latest-first date ordering keeps undated items last.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Lists active owned Todos.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_users Enforces the ownership boundary.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Patch()
  public async index(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: ITodoTodo.IRequest,
  ): Promise<IPage<ITodoTodo.ISummary>> {
    return TodoProvider.index({ user, body });
  }
}
