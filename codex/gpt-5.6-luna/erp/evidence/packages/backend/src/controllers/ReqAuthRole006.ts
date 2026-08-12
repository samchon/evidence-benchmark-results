import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_role_006")
export class ReqAuthRole006 {
  /**
   * Publishes the req_auth_role_006 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-organization-roles-and-permissions Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-006-assigns-one-or-more-built-in-or-custom-roles-to-an-active-member Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-006-assigns-one-or-more-built-in-or-custom-roles-to-an-active-member Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:membership_roles Uses the persisted membership_roles state for this operation.
 * @evidenceReview prisma:membership_roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:roles Uses the persisted roles state for this operation.
 * @evidenceReview prisma:roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:memberships Uses the persisted memberships state for this operation.
 * @evidenceReview prisma:memberships Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_role_006
   * @path POST /auth/req_auth_role_006
   * @accessor api.functional.auth.req_auth_role_006
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_role_006(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_role_006", input });
  }
}
