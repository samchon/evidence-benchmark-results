import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { ITodoUser } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Session continuation operation. */
@Controller("todo/auth/user/refresh-operation")
export class TodoAuthRefreshController {
  /**
   * Continue one valid session using its refresh proof.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Supports the requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and checked this host fields and behavior against its obligation.
   * @evidence prisma:todo_sessions Rotates and validates the session proof.
   * @evidenceReview prisma:todo_sessions Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   * @evidence prisma:todo_users Preserves the session's account identity.
   * @evidenceReview prisma:todo_users Compared this host with the cited Prisma model or column and checked the represented fields and behavior.
   */
  @core.TypedRoute.Post()
  public async refresh(
    @core.TypedBody() body: ITodoUser.IRefresh,
  ): Promise<ITodoUser.IAuthorized> {
    return AuthProvider.refresh({ body });
  }
}
