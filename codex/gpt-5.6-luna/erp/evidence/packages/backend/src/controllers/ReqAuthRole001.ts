import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_role_001")
export class ReqAuthRole001 {
  /**
   * Publishes the req_auth_role_001 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/04-business-rules.md#req-rule-role-role-integrity-rules Routes and enforces the complete requirement family at its public operation boundary.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-role-integrity-rules Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Owns the authentication requirement family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-the-organization-role-for-built-catalog-owner Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-the-organization-role-for-built-catalog-owner Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:roles Uses the persisted roles state for this operation.
 * @evidenceReview prisma:roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-role-001-built-in-roles-cannot-be-deleted Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-001-built-in-roles-cannot-be-deleted Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_role_001
   * @path POST /auth/req_auth_role_001
   * @accessor api.functional.auth.req_auth_role_001
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_role_001(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_role_001", input });
  }
}
