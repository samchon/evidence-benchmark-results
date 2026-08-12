import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_account_008")
export class ReqAuthAccount008 {
  /**
   * Publishes the req_auth_account_008 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-user-account-management Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-account-008-switch-the-active-organization Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-account-008-switch-the-active-organization Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:memberships Uses the persisted memberships state for this operation.
 * @evidenceReview prisma:memberships Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:organizations Uses the persisted organizations state for this operation.
 * @evidenceReview prisma:organizations Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_account_008
   * @path POST /auth/req_auth_account_008
   * @accessor api.functional.auth.req_auth_account_008
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_account_008(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_account_008", input });
  }
}
