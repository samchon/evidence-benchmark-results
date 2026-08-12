import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { AuthProvider } from "../providers/AuthProvider";

/** Permanent account deletion operation. */
@Controller("todo/user/account-delete")
export class TodoAccountDeleteController {
  /**
   * Permanently delete the current account after password confirmation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Supports the requirement.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_users Deletes the account and its cascaded private data.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_profiles Deletes the owned profile by cascade.
   * @evidenceReview prisma:todo_profiles Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todos Deletes owned active and trashed Todos by cascade.
   * @evidenceReview prisma:todo_todos Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_todo_histories Deletes Todo history by cascade.
   * @evidenceReview prisma:todo_todo_histories Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_sessions Deletes sessions by cascade.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_recovery_tokens Deletes recovery records by cascade.
   * @evidenceReview prisma:todo_recovery_tokens Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async erase(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: ITodoUser.IDelete,
  ): Promise<true> {
    return AuthProvider.erase({ user, body });
  }
}
