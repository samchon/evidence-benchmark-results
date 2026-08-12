import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_account_004")
export class ReqAuthAccount004 {
  /**
   * Publishes the req_auth_account_004 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-004-recover-account-access-by-email Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-004-recover-account-access-by-email Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-account-004-revokes-all-previously-active-sessions Revokes every active session during account recovery.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-004-revokes-all-previously-active-sessions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_account_004
   * @path POST /auth/req_auth_account_004
   * @accessor api.functional.auth.req_auth_account_004
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_account_004(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_account_004", input });
  }
}
