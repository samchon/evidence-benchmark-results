import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoTodo } from "@benchmark/todo-api";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Todo content edit operation. */
@Controller("todo/user/todo/edit")
export class TodoUpdateController {
  /**
   * Edit owned active content and append one immutable history entry.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-todo-4-edit-todo-content Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-todo-state-conflict-and-history-rules Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-3-refuse-no-op-and-stale-content-edits Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-state-4-create-immutable-content-edit-history Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-1-keep-todo-edits-and-history-consistent Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Updates the content version atomically.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories Appends the immutable edit record.
   * @evidenceReview prisma:todo_todo_histories Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Put(":id")
  public async update(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
    @core.TypedBody() body: ITodoTodo.IUpdate,
  ): Promise<ITodoTodo> {
    return TodoProvider.update({ user, id, body });
  }
}
