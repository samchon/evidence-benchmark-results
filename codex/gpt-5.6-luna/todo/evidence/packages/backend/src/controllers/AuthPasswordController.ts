import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IActionResult, IAuth } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";

/** Password replacement operation. */
@Controller("todo-auth-password")
@UseGuards(AuthGuard)
export class AuthPasswordController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Implements account security management.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Replaces the password after current-password proof.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Applies replacement credential rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Applies the new-password boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Replaces the credential and invalidates old sessions.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Ends prior session continuity.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Invalidates every prior account session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Enforces authenticated account authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires the current session.
   * @evidence prisma:todo_accounts Updates the password hash.
   * @evidence prisma:todo_sessions Revokes prior sessions.
   */
  @core.TypedRoute.Put()
  public async password(@Req() req: Request, @core.TypedBody() body: IAuth.IChangePassword): Promise<IActionResult> { await AuthProvider.changePassword(AuthProvider.request(req), body); return { success: true }; }
}
