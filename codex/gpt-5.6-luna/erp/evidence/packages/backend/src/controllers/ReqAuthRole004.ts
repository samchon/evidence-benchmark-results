import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_role_004")
export class ReqAuthRole004 {
  /**
   * Publishes the req_auth_role_004 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-an-owner-composes-a-custom-role-from-any-available-permission-combination Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-004-an-owner-composes-a-custom-role-from-any-available-permission-combination Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:roles Uses the persisted roles state for this operation.
 * @evidenceReview prisma:roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-role-004-a-custom-role-cannot-be-deleted-while-any-member-holds-it Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-role-004-a-custom-role-cannot-be-deleted-while-any-member-holds-it Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_role_004
   * @path POST /auth/req_auth_role_004
   * @accessor api.functional.auth.req_auth_role_004
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_role_004(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_role_004", input });
  }
}
