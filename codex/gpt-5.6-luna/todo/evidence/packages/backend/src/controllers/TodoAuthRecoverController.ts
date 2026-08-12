import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Non-disclosing password recovery start operation. */
@Controller("todo/auth/user/recover-operation")
export class TodoAuthRecoverController {
  /**
   * Start password recovery without disclosing whether the email is registered.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_users Finds the registered identity without disclosure.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_recovery_tokens Records a one-time recovery proof.
   * @evidenceReview prisma:todo_recovery_tokens Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async recover(@core.TypedBody() body: ITodoUser.IRecover): Promise<true> {
    return AuthProvider.recover({ body });
  }
}
