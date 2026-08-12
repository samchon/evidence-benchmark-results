import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_membership_006")
export class ReqAuthMembership006 {
  /**
   * Publishes the req_auth_membership_006 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:memberships Uses the persisted memberships state for this operation.
 * @evidenceReview prisma:memberships Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:roles Uses the persisted roles state for this operation.
 * @evidenceReview prisma:roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:membership_roles Uses the persisted membership_roles state for this operation.
 * @evidenceReview prisma:membership_roles Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-membership-006-removes-access-from-every-existing-session Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-006-removes-access-from-every-existing-session Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_membership_006
   * @path POST /auth/req_auth_membership_006
   * @accessor api.functional.auth.req_auth_membership_006
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_membership_006(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_membership_006", input });
  }
}
