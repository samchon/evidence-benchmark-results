import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Public login operation. */
@Controller("todo/auth/user/login-operation")
export class TodoAuthLoginController {
  /**
   * Log in with canonical email credentials and create another session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Supports the requirement.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_users Reads the canonical credential identity.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_sessions Creates an independent login session.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async login(
    @core.TypedBody() body: ITodoUser.ILogin,
  ): Promise<ITodoUser.IAuthorized> {
    return AuthProvider.login({ body });
  }
}
