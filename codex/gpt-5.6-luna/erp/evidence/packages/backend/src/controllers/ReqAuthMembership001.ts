import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuthRecord, IAuthRequest } from "@benchmark/erp-api";
import { AuthProvider } from "../providers/AuthProvider";

@Controller("auth/req_auth_membership_001")
export class ReqAuthMembership001 {
  /**
   * Publishes the req_auth_membership_001 authentication contract.
   *
   * @param input Authentication and authority command fields.
   * @evidence docs/analysis/04-business-rules.md#req-rule-membership-membership-and-role-rules Routes and enforces the complete requirement family at its public operation boundary.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-membership-and-role-rules Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Owns the authentication requirement family.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-001-records-invited-active-suspended-or-revoked-status-for-one-user-and-one-organization Publishes the exact authentication requirement.
   * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-membership-001-records-invited-active-suspended-or-revoked-status-for-one-user-and-one-organization Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence prisma:memberships Uses the persisted memberships state for this operation.
 * @evidenceReview prisma:memberships Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:users Uses the persisted users state for this operation.
 * @evidenceReview prisma:users Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
 * @evidence prisma:organizations Uses the persisted organizations state for this operation.
 * @evidenceReview prisma:organizations Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-membership-001-the-pair-of-organization-and-user-identifies-at-most-one-membership Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-membership-001-the-pair-of-organization-and-user-identifies-at-most-one-membership Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The resulting authority state without credential digests.
   *
   * @controller AuthController.req_auth_membership_001
   * @path POST /auth/req_auth_membership_001
   * @accessor api.functional.auth.req_auth_membership_001
   * @tag AUTH
   */
  @core.TypedRoute.Post("execute")
  public async req_auth_membership_001(
    @core.TypedBody() input: IAuthRequest,
  ): Promise<IAuthRecord> {
    return AuthProvider.execute({ operation: "req_auth_membership_001", input });
  }
}
