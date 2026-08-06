import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IActionResult } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";

/** All-session logout operation. */
@Controller("todo-auth-logout-all")
@UseGuards(AuthGuard)
export class AuthLogoutAllController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Implements session logout.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Revokes every session owned by the account.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends every session's owner authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires the authenticated session.
   * @evidence prisma:todo_sessions Persists account-wide revocation.
   */
  @core.TypedRoute.Post()
  public async logoutAll(@Req() req: Request): Promise<IActionResult> { await AuthProvider.logoutAll(AuthProvider.request(req)); return { success: true }; }
}
