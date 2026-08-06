import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IPage, ITodoRequest, ITodoSummary } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo list operation. */
@Controller("todo-index")
@UseGuards(AuthGuard)
export class TodoIndexController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Lists owned tasks.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Returns the summary task fields.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Filters by the authenticated owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Lists lifecycle state.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Selects active availability.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-2-browse-active-todos Lists active owned Todos.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Implements active browsing controls.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Applies bounded pagination.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-2-filter-active-todos-by-completion Applies completion filtering.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-3-sort-active-todos-by-supported-dates Applies supported date sorting.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Applies deterministic ordering.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies state-qualified browsing.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Selects only active tasks.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Lists only the current owner's tasks.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps list results private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Excludes other accounts' tasks.
   * @evidence prisma:todo_todos Queries active owned rows.
   */
  @core.TypedRoute.Patch()
  public async index(@Req() req: Request, @core.TypedBody() body: ITodoRequest): Promise<IPage<ITodoSummary>> { return TodoProvider.index(AuthProvider.request(req), body); }
}
