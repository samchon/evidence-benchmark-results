import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_position_002")
export class ReqAuthPosition002 {
  /**
   * Publishes the req_auth_position_002 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-scoped-manager-positions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-position-002-assigns-or-clears-the-project-manager-of-a-specific-project Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-position-002-assigns-or-clears-the-project-manager-of-a-specific-project Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:projects Uses the persisted projects state for this operation.
 * @evidenceReview prisma:projects Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:employees Uses the persisted employees state for this operation.
 * @evidenceReview prisma:employees Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-automation-002-automated-work-cannot-cross-organization-boundaries-or-bypass-the-business-rules-that-apply-to-users Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-automation-002-automated-work-cannot-cross-organization-boundaries-or-bypass-the-business-rules-that-apply-to-users Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_position_002
   * @path POST /auth/req_auth_position_002
   * @accessor api.functional.auth.req_auth_position_002
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_position_002(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_position_002", input });
  }
}
