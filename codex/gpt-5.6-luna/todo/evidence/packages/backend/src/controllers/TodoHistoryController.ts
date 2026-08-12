import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodoHistory } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { HistoryProvider } from "../providers/HistoryProvider";

/** Full owner-scoped Todo history operation. */
@Controller("todo/user/todo/history")
export class TodoHistoryController {
  /**
   * Read every immutable content edit newest first.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-edit-history-meaning-and-relationship Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-1-define-an-edit-history-entry Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-history-2-bind-history-to-its-todo-lifecycle Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-edit-history-inspection Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-history-1-view-a-todos-full-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todo_histories Reads immutable history entries.
   * @evidenceReview prisma:todo_todo_histories Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todos Enforces Todo ownership and lifecycle.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Get(":todoId")
  public async index(
    @UserAuth() user: UserPayload,
    @core.TypedParam("todoId") todoId: string & tags.Format<"uuid">,
  ): Promise<ITodoTodoHistory[]> {
    return HistoryProvider.index({ user, todoId });
  }
}
