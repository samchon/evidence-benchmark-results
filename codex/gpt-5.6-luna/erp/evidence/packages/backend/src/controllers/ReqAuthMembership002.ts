import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_membership_002")
export class ReqAuthMembership002 {
  /**
   * Publishes the req_auth_membership_002 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Owns the authentication requirement family.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-002-accepts-the-invitation Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-002-accepts-the-invitation Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:memberships Uses the persisted memberships state for this operation.
 * @evidenceReview prisma:memberships Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:invitations Uses the persisted invitations state for this operation.
 * @evidenceReview prisma:invitations Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-membership-002-only-active-memberships-may-select-an-organization-or-perform-organization-work Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-002-only-active-memberships-may-select-an-organization-or-perform-organization-work Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_membership_002
   * @path POST /auth/req_auth_membership_002
   * @accessor api.functional.auth.req_auth_membership_002
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_membership_002(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_membership_002", input });
  }
}
