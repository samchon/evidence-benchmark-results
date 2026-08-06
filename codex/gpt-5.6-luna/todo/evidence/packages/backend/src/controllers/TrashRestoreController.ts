import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Trash restoration operation. */
@Controller("todo-trash-restore")
@UseGuards(AuthGuard)
export class TrashRestoreController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Restores the owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Preserves the task owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Applies the availability dimension.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Changes trashed to active.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-4-restore-a-trashed-todo Restores the same Todo identity.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-trash-recovery-journey Implements the trash recovery surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-3-restore-a-todo-from-trash Restores a Todo from trash.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies availability qualification.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only trashed tasks.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Restores only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps restoration private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner restoration.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves lifecycle integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Returns the same complete task to active work.
   * @evidence prisma:todo_todos Clears trash state on the owned row.
   */
  @core.TypedRoute.Put(":id/restore")
  public async restore(@Req() req: Request, @core.TypedParam("id") id: string): Promise<ITodo> { return TodoProvider.restore(AuthProvider.request(req), id); }
}
