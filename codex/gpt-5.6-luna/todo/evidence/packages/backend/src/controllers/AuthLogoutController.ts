import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IActionResult } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";

/** Current-session logout operation. */
@Controller("todo-auth-logout")
@UseGuards(AuthGuard)
export class AuthLogoutController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Implements session logout.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Revokes only the current session.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends the current owner authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires the authenticated session.
   * @evidence prisma:todo_sessions Persists current-session revocation.
   */
  @core.TypedRoute.Post()
  public async logout(@Req() req: Request): Promise<IActionResult> { await AuthProvider.logout(AuthProvider.request(req)); return { success: true }; }
}
