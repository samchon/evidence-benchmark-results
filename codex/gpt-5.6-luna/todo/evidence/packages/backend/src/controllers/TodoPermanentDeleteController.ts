import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { tags } from "typia";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { TodoProvider } from "../providers/TodoProvider";

/** Permanent trashed Todo deletion operation. */
@Controller("todo/user/trash/delete")
export class TodoPermanentDeleteController {
  /**
   * Permanently delete one owned trashed Todo and its complete history.
   * @evidence docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Supports the requirement.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-todo-life-5-permanently-delete-a-trashed-todo Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Supports the requirement.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-trash-4-permanently-delete-a-todo-from-trash Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_todos Deletes the retained Todo.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories Deletes its complete history by cascade.
   * @evidenceReview prisma:todo_todo_histories Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Delete(":id")
  public async erase(
    @UserAuth() user: UserPayload,
    @core.TypedParam("id") id: string & tags.Format<"uuid">,
  ): Promise<true> {
    return TodoProvider.erase({ user, id });
  }
}
