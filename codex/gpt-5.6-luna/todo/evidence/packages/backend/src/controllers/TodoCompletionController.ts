import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo, ITodoCompletion } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo completion operation. */
@Controller("todo-completion")
@UseGuards(AuthGuard)
export class TodoCompletionController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Changes the owned task state.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Preserves the task owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Applies the independent completion dimension.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Maintains complete/incomplete state.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-5-mark-a-todo-complete Marks an active Todo complete.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-6-mark-a-todo-incomplete Marks an active Todo incomplete.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies state-qualified completion.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only active tasks.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-2-make-repeated-completion-requests-idempotent Makes repeated requests no-ops.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Changes only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps completion private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Rejects cross-owner changes.
   * @evidence prisma:todo_todos Persists completion state.
   */
  @core.TypedRoute.Put(":id/completion")
  public async completion(@Req() req: Request, @core.TypedParam("id") id: string, @core.TypedBody() body: ITodoCompletion): Promise<ITodo> { return TodoProvider.complete(AuthProvider.request(req), id, body); }
}
