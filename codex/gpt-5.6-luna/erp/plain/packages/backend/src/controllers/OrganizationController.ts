import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { OrganizationProvider } from "../providers/OrganizationProvider";

/** Tenant configuration and membership administration. */
@Controller("erp/organization")
@UseGuards(ErpAuthGuard)
export class OrganizationController {
  /** Views the selected organization's configuration. @tag Organization */
  @core.TypedRoute.Get()
  public async at(@ErpAuth() actor: ErpPayload): Promise<api.IOrganization> { return OrganizationProvider.at({ actor }); }
  /** Updates Owner-controlled organization configuration. @tag Organization */
  @core.TypedRoute.Put()
  public async update(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IOrganization.IUpdate): Promise<api.IOrganization> { return OrganizationProvider.update({ actor, body }); }
  /** Explains every record preventing organization deletion. @tag Organization */
  @core.TypedRoute.Get("deletion-check")
  public async deletionCheck(@ErpAuth() actor: ErpPayload): Promise<api.IOrganization.IDeletionCheck> { return OrganizationProvider.deletionCheck({ actor }); }
  /** Deletes an eligible organization and retains a sensitive audit event. @tag Organization */
  @core.TypedRoute.Delete()
  public async erase(@ErpAuth() actor: ErpPayload): Promise<api.IEntity> { return OrganizationProvider.erase({ actor }); }
  /** Issues a pending membership invitation. @tag Membership */
  @core.TypedRoute.Post("invitation")
  public async invite(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IOrganization.IInvite): Promise<api.IInvitation> { return OrganizationProvider.invite({ actor, body }); }
  /** Lists memberships in the selected organization. @tag Membership */
  @core.TypedRoute.Patch("membership")
  public async memberships(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IMembership>> { return OrganizationProvider.membershipIndex({ actor, input }); }
  /** Suspends a membership while retaining its roles. @tag Membership */
  @core.TypedRoute.Put("membership/:id/suspend")
  public async suspend(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMembership> { return OrganizationProvider.suspend({ actor, id }); }
  /** Reactivates a suspended membership. @tag Membership */
  @core.TypedRoute.Put("membership/:id/reactivate")
  public async reactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMembership> { return OrganizationProvider.reactivate({ actor, id }); }
  /** Revokes a membership while preserving history. @tag Membership */
  @core.TypedRoute.Delete("membership/:id")
  public async revoke(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMembership> { return OrganizationProvider.revoke({ actor, id }); }
}
