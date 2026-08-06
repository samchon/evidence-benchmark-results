import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo, ITodoUpdate } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo content-edit operation. */
@Controller("todo-update")
@UseGuards(AuthGuard)
export class TodoUpdateController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Updates the owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Updates task content and dates.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Preserves the task owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Appends content chronology.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Stores changed-to values.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Keeps history attached to the task.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Updates content and history atomically.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Applies edit content rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Validates edited title and description.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Validates edited dates.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies edit conflict and history rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only active tasks.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Rejects stale and no-op edits.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Creates one immutable history entry.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Updates only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps task changes private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner edits.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves update integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Commits the Todo and matching history together.
   * @evidence prisma:todo_todos Updates current content.
   * @evidence prisma:todo_todo_histories Appends the matching history entry.
   */
  @core.TypedRoute.Put(":id")
  public async update(@Req() req: Request, @core.TypedParam("id") id: string, @core.TypedBody() body: ITodoUpdate): Promise<ITodo> { return TodoProvider.update(AuthProvider.request(req), id, body); }
}
