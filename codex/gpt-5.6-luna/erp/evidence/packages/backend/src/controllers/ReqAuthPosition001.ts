import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_position_001")
export class ReqAuthPosition001 {
  /**
   * Publishes the req_auth_position_001 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-001-assigns-or-clears-the-department-manager-of-a-specific-department Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-001-assigns-or-clears-the-department-manager-of-a-specific-department Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:departments Uses the persisted departments state for this operation.
 * @evidenceReview prisma:departments Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:employees Uses the persisted employees state for this operation.
 * @evidenceReview prisma:employees Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-001-organizations-system-automation-for-organizations-rely-scheduled Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-001-organizations-system-automation-for-organizations-rely-scheduled Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-004-retrying-system-automation-for-retrying-failed-automated Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-004-retrying-system-automation-for-retrying-failed-automated Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_position_001
   * @path POST /auth/req_auth_position_001
   * @accessor api.functional.auth.req_auth_position_001
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_position_001(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_position_001", input });
  }
}
