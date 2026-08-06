import * as core from "@nestia/core";
import { Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import type { IActionResult, IAuth } from "@benchmark/todo-api";
import { AuthGuard } from "../guards/AuthGuard";
import { AuthProvider } from "../providers/AuthProvider";

/** Terminal account deletion operation. */
@Controller("todo-auth-account")
@UseGuards(AuthGuard)
export class AuthAccountController {
  /**
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Implements terminal account management.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Deletes the authenticated account scope.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Ends account authority permanently.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Requires current-password authority.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-2-limit-authority-to-owned-private-information Deletes only the current account's data.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Removes private information only inside the selected account boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-1-isolate-every-accounts-private-information Prevents surviving cross-account exposure.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-change-and-deletion-integrity Preserves deletion integrity.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Completes account deletion as one cascade.
   * @evidence prisma:todo_accounts Cascades account deletion.
   * @evidence prisma:todo_profiles Cascades the profile deletion.
   * @evidence prisma:todo_sessions Cascades session deletion.
   * @evidence prisma:todo_todos Cascades active and trashed Todo deletion.
   * @evidence prisma:todo_todo_histories Cascades attached history deletion.
   */
  @core.TypedRoute.Delete()
  public async erase(@Req() req: Request, @core.TypedBody() body: IAuth.IDeleteAccount): Promise<IActionResult> { await AuthProvider.erase(AuthProvider.request(req), body); return { success: true }; }
}
