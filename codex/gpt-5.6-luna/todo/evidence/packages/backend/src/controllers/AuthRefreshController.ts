import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Session continuation operation. */
@Controller("todo-auth-refresh")
export class AuthRefreshController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Implements session continuity.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Renews the same valid session authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Preserves the existing owner boundary.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Rejects invalid session proofs before private access.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Keeps the same account identity.
   * @evidence prisma:todo_sessions Rotates the stored refresh proof.
   * @setHeader token.access Authorization
   */
  @core.TypedRoute.Post()
  public async refresh(@core.TypedBody() body: IAuth.IRefresh): Promise<IAuth.IAuthorized> { return AuthProvider.refresh(body); }
}
