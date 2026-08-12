import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import { UserAuth } from "../decorators/UserAuth";
import type { UserPayload } from "../decorators/UserPayload";
import { AuthProvider } from "../providers/AuthProvider";

/** All-session logout operation. */
@Controller("todo/user/logout-all")
export class TodoLogoutAllController {
  /**
   * End every session belonging to the current account.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_sessions Revokes every session owned by the account.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async logoutAll(@UserAuth() user: UserPayload): Promise<true> {
    return AuthProvider.logoutAll({ user });
  }
}
