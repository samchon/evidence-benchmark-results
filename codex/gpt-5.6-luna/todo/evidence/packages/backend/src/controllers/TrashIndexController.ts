import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IPage, ITodoRequest, ITodoSummary } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Trash list operation. */
@Controller("todo-trash-index")
@UseGuards(AuthGuard)
export class TrashIndexController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Lists owned tasks.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Returns summary task fields.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Filters by the authenticated owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Lists lifecycle state.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Selects trashed availability.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Implements the trash recovery surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-1-browse-trashed-todos Lists retained Todos.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-todo-browsing-rules Applies shared browse bounds.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-1-bound-todo-list-pagination Applies bounded pagination.
   * @evidence docs/analysis/04-business-rules.md#req-rule-browse-4-apply-stable-default-and-tie-break-ordering Applies deterministic trash ordering.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies availability qualification.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Selects only trashed tasks.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Lists only the current owner's tasks.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps trash results private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Excludes other accounts' tasks.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves recoverable list state.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Keeps the same task discoverable in trash.
   * @evidence prisma:todo_todos Queries trashed rows.
   */
  @core.TypedRoute.Patch()
  public async index(@Req() req: Request, @core.TypedBody() body: ITodoRequest): Promise<IPage<ITodoSummary>> { return TodoProvider.index(AuthProvider.request(req), body, true); }
}
