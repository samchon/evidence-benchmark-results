import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IActionResult, IAuth } from "@benchmark/todo-api";
import { AuthProvider } from "../providers/AuthProvider";

/** Forgotten-password recovery operation. */
@Controller("todo-auth-recover")
export class AuthRecoverController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Implements account security management.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Replaces the credential after email proof.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Applies replacement credential rules.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Matches the canonical recovery identity.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Applies the replacement password boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Invalidates prior credential sessions.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Ends prior session continuity.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Revokes all prior account sessions.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Provides the non-authenticated recovery entry.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Does not expose private data before proof.
   * @evidence prisma:todo_accounts Updates the password hash.
   * @evidence prisma:todo_sessions Revokes prior sessions.
   */
  @core.TypedRoute.Post()
  public async recover(@core.TypedBody() body: IAuth.IRecover): Promise<IActionResult> { await AuthProvider.recover(body); return { success: true }; }
}
