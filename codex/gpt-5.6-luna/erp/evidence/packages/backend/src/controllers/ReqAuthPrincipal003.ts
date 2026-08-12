import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_principal_003")
export class ReqAuthPrincipal003 {
  /**
   * Publishes the req_auth_principal_003 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-acting-principals Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-principal-003-each-acting-principal-for-each-system-scheduled Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-principal-003-each-acting-principal-for-each-system-scheduled Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:system_principals Uses the persisted system_principals state for this operation.
 * @evidenceReview prisma:system_principals Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_principal_003
   * @path POST /auth/req_auth_principal_003
   * @accessor api.functional.auth.req_auth_principal_003
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_principal_003(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_principal_003", input });
  }
}
