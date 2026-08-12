import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_position_003")
export class ReqAuthPosition003 {
  /**
   * Publishes the req_auth_position_003 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-003-approval-manager-position-for-approval-routing-resolves Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-003-approval-manager-position-for-approval-routing-resolves Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:approval_requests Uses the persisted approval_requests state for this operation.
 * @evidenceReview prisma:approval_requests Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:employees Uses the persisted employees state for this operation.
 * @evidenceReview prisma:employees Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-003-authorized-users-can-inspect-the-trigger-result-audit-evidence Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-003-authorized-users-can-inspect-the-trigger-result-audit-evidence Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_position_003
   * @path POST /auth/req_auth_position_003
   * @accessor api.functional.auth.req_auth_position_003
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_position_003(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_position_003", input });
  }
}
