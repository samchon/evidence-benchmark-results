import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { AuthProvider } from "../providers/AuthProvider";

/** Authenticated password change operation. */
@Controller("todo/user/password")
export class TodoPasswordController {
  /**
   * Replace the password after checking the existing password.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_users Replaces the credential atomically.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_sessions Revokes all existing sessions.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async changePassword(
    @UserAuth() user: UserPayload,
    @core.TypedBody() body: ITodoUser.IChangePassword,
  ): Promise<true> {
    return AuthProvider.changePassword({ user, body });
  }
}
