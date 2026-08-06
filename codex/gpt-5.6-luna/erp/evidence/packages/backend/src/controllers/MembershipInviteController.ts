
import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IAuth, IMembership } from "@benchmark/erp-api";
import { MembershipProvider } from "../providers/MembershipProvider";

/** Publishes Owner membership invitations. */
@Controller("organization-membership-invite")
export class MembershipInviteController {



  /**
   * Invite a person into the active organization.
   * @param headers Owner credentials.
   * @param input Recipient and initial role.
   * @returns The invited membership summary.
   * @tag Membership
   * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-001-owner-issues-membership-invitation Issues a membership invitation without granting access.
   */
  @core.TypedRoute.Post()

  public async invite(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IMembership.IInvite): Promise<IMembership> {
    return MembershipProvider.invite({ headers, input });
  }
}
