import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo, ITodoCreate } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo creation operation. */
@Controller("todo-create")
@UseGuards(AuthGuard)
export class TodoCreateController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Creates an owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Persists the required and optional task fields.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Assigns the task to the authenticated account.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Begins the task lifecycle.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-1-define-completion-states Begins the task incomplete.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Begins the task active.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-1-create-a-todo Creates an active incomplete Todo.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-todo-content-and-date-rules Applies content and date rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-1-validate-todo-title-and-description Validates title and description.
   * @evidence docs/analysis/04-business-rules.md#req-rule-content-2-validate-todo-planning-dates Validates the date pair.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Assigns ownership to the current account.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Creates private Todo data.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Creates no cross-account row.
   * @evidence prisma:todo_todos Persists the owned task.
   */
  @core.TypedRoute.Post()
  public async create(@Req() req: Request, @core.TypedBody() body: ITodoCreate): Promise<ITodo> { return TodoProvider.create(AuthProvider.request(req), body); }
}
