
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IMembership } from "@benchmark/erp-api";
import { MembershipProvider } from "../providers/MembershipProvider";

/** Publishes Owner membership state changes. */
@Controller("organization-membership-status")
export class MembershipStatusController {



  /**
   * Change a member's organization authority state as an Owner.
   * @param headers Owner credentials.
   * @param id Membership identifier.
   * @param input Active, suspended, or revoked state.
   * @returns Updated membership.
   * @tag Membership
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-membership-006-refuses-membership-actions-that-would-leave-it-without-an-active-owner Refuses changes that remove the last active Owner.
   */
  @core.TypedRoute.Put(":id/status")

  public async status(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IMembership.IStatus): Promise<IMembership> {
    return MembershipProvider.status({ headers, id, input });
  }
}
