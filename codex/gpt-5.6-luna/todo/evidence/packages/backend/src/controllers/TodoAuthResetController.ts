import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Password recovery proof consumption operation. */
@Controller("todo/auth/user/recover/reset-operation")
export class TodoAuthResetController {
  /**
   * Consume a delivered one-time proof and replace the forgotten password.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_recovery_tokens Consumes the one-time proof.
   * @evidenceReview prisma:todo_recovery_tokens Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_users Replaces the credential.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_sessions Revokes older sessions.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async reset(@core.TypedBody() body: ITodoUser.IReset): Promise<true> {
    return AuthProvider.reset({ body });
  }
}
