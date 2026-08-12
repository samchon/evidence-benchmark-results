import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_account_002")
export class ReqAuthAccount002 {
  /**
   * Publishes the req_auth_account_002 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-002-update-the-global-user-profile Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-002-update-the-global-user-profile Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_account_002
   * @path POST /auth/req_auth_account_002
   * @accessor api.functional.auth.req_auth_account_002
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_account_002(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_account_002", input });
  }
}
