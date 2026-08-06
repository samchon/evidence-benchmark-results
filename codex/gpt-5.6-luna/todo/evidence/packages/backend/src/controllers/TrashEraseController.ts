import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IActionResult } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Permanent trash deletion operation. */
@Controller("todo-trash-erase")
@UseGuards(AuthGuard)
export class TrashEraseController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Deletes the owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Deletes only the current owner's task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Applies terminal lifecycle deletion.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Removes a trashed Todo.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Removes attached chronology.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Deletes history through its Todo.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Implements the trash recovery surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Permanently deletes a trashed Todo.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies terminal state qualification.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only trashed tasks.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Removes history only through terminal deletion.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Deletes only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps deletion private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner deletion.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves terminal deletion integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Deletes the Todo and attached history together.
   * @evidence prisma:todo_todos Deletes the trashed row.
   * @evidence prisma:todo_todo_histories Deletes attached history through cascade.
   */
  @core.TypedRoute.Delete(":id")
  public async erase(@Req() req: Request, @core.TypedParam("id") id: string): Promise<IActionResult> { await TodoProvider.erase(AuthProvider.request(req), id); return { success: true }; }
}
