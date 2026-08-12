import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { AuthProvider } from "../providers/AuthProvider";

/** Current-session logout operation. */
@Controller("todo/user/logout-operation")
export class TodoLogoutController {
  /**
   * End only the current session; other sessions remain valid.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_sessions Revokes only the current session.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async logout(@UserAuth() user: UserPayload): Promise<true> {
    return AuthProvider.logout({ user });
  }
}
