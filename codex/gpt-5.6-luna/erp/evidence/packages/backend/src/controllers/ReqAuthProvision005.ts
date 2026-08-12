import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_provision_005")
export class ReqAuthProvision005 {
  /**
   * Publishes the req_auth_provision_005 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-005-refuse-ineligible-authentication Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-005-refuse-ineligible-authentication Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:sessions Uses the persisted sessions state for this operation.
 * @evidenceReview prisma:sessions Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-account-002-user-account-refusal Refuses login when credentials, account status, or active membership are invalid.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-account-002-user-account-refusal Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_provision_005
   * @path POST /auth/req_auth_provision_005
   * @accessor api.functional.auth.req_auth_provision_005
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_provision_005(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_provision_005", input });
  }
}
