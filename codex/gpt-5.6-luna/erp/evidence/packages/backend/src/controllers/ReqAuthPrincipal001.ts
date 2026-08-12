import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_principal_001")
export class ReqAuthPrincipal001 {
  /**
   * Publishes the req_auth_principal_001 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-001-the-product-distinguishes-credentialed-users-non-authenticating-external-parties Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-001-the-product-distinguishes-credentialed-users-non-authenticating-external-parties Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:system_principals Uses the persisted system_principals state for this operation.
 * @evidenceReview prisma:system_principals Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:customers Uses the persisted customers state for this operation.
 * @evidenceReview prisma:customers Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:vendors Uses the persisted vendors state for this operation.
 * @evidenceReview prisma:vendors Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_principal_001
   * @path POST /auth/req_auth_principal_001
   * @accessor api.functional.auth.req_auth_principal_001
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_principal_001(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_principal_001", input });
  }
}
