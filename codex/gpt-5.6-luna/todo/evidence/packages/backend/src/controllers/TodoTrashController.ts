import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Soft-delete operation. */
@Controller("todo-trash")
@UseGuards(AuthGuard)
export class TodoTrashController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Moves the owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Preserves the task owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Applies the availability dimension.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Changes active to trashed.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-3-move-an-active-todo-to-trash Records the latest trash time.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-7-move-a-todo-to-trash Moves an active Todo to trash.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies lifecycle qualification.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only active tasks.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Moves only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps trash state private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner trashing.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves lifecycle integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-2-preserve-recoverable-todo-state Moves the same task into recoverable trash.
   * @evidence prisma:todo_todos Persists trash state.
   */
  @core.TypedRoute.Delete(":id")
  public async trash(@Req() req: Request, @core.TypedParam("id") id: string): Promise<ITodo> { return TodoProvider.trash(AuthProvider.request(req), id); }
}
