
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IMembership, IPage } from "@benchmark/erp-api";
import { MembershipProvider } from "../providers/MembershipProvider";

/** Publishes global membership discovery. */
@Controller("organization-membership-list")
export class MembershipIndexController {
/**
   * List the signed-in user's memberships.
   * @param headers Global credentials.
   * @returns Membership state and effective role names.
   * @tag Membership
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-organization-membership-lifecycle Covers the membership lifecycle operations.
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-002-accepts-the-invitation Lists independent membership state per organization.
 * @evidence prisma:memberships Exposes the persisted memberships record through this operation.
*/
  @core.TypedRoute.Patch("list")
  public async index(@core.TypedHeaders() headers: IAuth.IHeaders): Promise<IPage<IMembership>> {
    return MembershipProvider.index({ headers });
  }
}
