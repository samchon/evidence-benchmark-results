import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_role_002")
export class ReqAuthRole002 {
  /**
   * Publishes the req_auth_role_002 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-a-members-effective-authority-is-the-union-of-every-built-in-and-custom-role-assigned-in-the-active-organization Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-002-a-members-effective-authority-is-the-union-of-every-built-in-and-custom-role-assigned-in-the-active-organization Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:roles Uses the persisted roles state for this operation.
 * @evidenceReview prisma:roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:membership_roles Uses the persisted membership_roles state for this operation.
 * @evidenceReview prisma:membership_roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-role-002-a-custom-role-may-contain-any-available-permission-combination-within-its-organization Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-002-a-custom-role-may-contain-any-available-permission-combination-within-its-organization Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_role_002
   * @path POST /auth/req_auth_role_002
   * @accessor api.functional.auth.req_auth_role_002
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_role_002(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_role_002", input });
  }
}
