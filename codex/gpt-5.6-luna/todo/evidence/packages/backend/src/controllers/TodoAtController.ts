import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { ITodo } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";
import { TodoProvider } from "../providers/TodoProvider";

/** Active Todo detail operation. */
@Controller("todo-detail")
@UseGuards(AuthGuard)
export class TodoAtController {
  /**
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-todo-meaning-and-ownership Reads the owned task.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-1-define-todo-information Returns full task information.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-2-bind-each-todo-to-one-account Resolves only the current owner's row.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-todo-lifecycle Applies lifecycle availability.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-2-define-active-and-trashed-availability Selects active detail only.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-todo-operations Implements the Todo operation surface.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-3-view-an-active-todo Returns active detail.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Applies availability qualification.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-1-qualify-operations-by-todo-availability Accepts only active tasks.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Uses the authenticated account boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires a valid session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Reads only the current owner's task.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Keeps task detail private.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Does not reveal other owners' tasks.
   * @evidence prisma:todo_todos Reads the owned active row.
   */
  @core.TypedRoute.Get(":id")
  public async at(@Req() req: Request, @core.TypedParam("id") id: string): Promise<ITodo> { return TodoProvider.at(AuthProvider.request(req), id); }
}
