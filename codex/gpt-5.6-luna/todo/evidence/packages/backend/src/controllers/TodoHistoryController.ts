import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodoHistory } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo edit-history operation. */
@Controller("todo-history")
@UseGuards(AuthGuard)
export class TodoHistoryController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Reads private edit chronology.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Returns changed-to values.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Resolves history through the Todo owner.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Implements history inspection.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Returns full newest-first history.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies history state rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Preserves history access for active or trashed tasks.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Returns immutable entries.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Reads only the current owner's history.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps history private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner history access.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves history integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Reads the accepted edit chronology.
   * @evidence prisma:todo_todos Verifies Todo ownership before reading history.
   * @evidence prisma:todo_todo_histories Reads immutable history rows.
   */
  @core.TypedRoute.Get(":id/history")
  public async history(@Req() req: Request, @core.TypedParam("id") id: string): Promise<ITodoHistory[]> { return TodoProvider.history(AuthProvider.request(req), id); }
}
