import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { AuthProvider } from "../providers/AuthProvider";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";

/** Public and signed-in identity lifecycle operations. */
@Controller("erp/auth")
export class AuthController {
  /** Creates a tenant and its first Owner. @tag Organization */
  @core.TypedRoute.Post("organization")
  public async organization(@core.TypedBody() body: api.IOrganization.ICreate): Promise<api.IUser.IAuthorized & { organization: api.IOrganization }> { return AuthProvider.createOrganization({ body }); }
  /** Authenticates an eligible global user and issues an independent session. @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("login")
  public async login(@core.TypedBody() body: api.IUser.ILogin): Promise<api.IUser.IAuthorized> { return AuthProvider.login({ body }); }
  /** Rotates a refresh credential into a new access session. @setHeader token.access Authorization @tag Authentication */
  @core.TypedRoute.Post("refresh")
  public async refresh(@core.TypedBody() body: api.IUser.IRefresh): Promise<api.IUser.IAuthorized> { return AuthProvider.refresh({ body }); }
  /** Accepts an Owner-issued membership invitation. @tag Authentication */
  @core.TypedRoute.Post("invitation/accept")
  public async accept(@core.TypedBody() body: api.IUser.IAcceptInvitation): Promise<api.IUser.IAuthorized> { return AuthProvider.acceptInvitation({ body }); }
  /** Selects an active membership as the operating context. @tag Authentication */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Put("membership/:id/select")
  public async select(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IMembership> { return AuthProvider.selectMembership({ actor, membershipId: id }); }
  /** Ends only the current session. @tag Authentication */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Delete("session")
  public async logout(@ErpAuth() actor: ErpPayload): Promise<api.IEntity> { return AuthProvider.logout({ actor }); }
  /** Ends every active session of the current user. @tag Authentication */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Delete("sessions")
  public async logoutAll(@ErpAuth() actor: ErpPayload): Promise<api.IEntity> { return AuthProvider.logoutAll({ actor }); }
  /** Reads the global self-service profile. @tag Account */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Get("profile")
  public async profile(@ErpAuth() actor: ErpPayload): Promise<api.IUser> { return AuthProvider.profile({ actor }); }
  /** Updates global self-service profile fields. @tag Account */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Put("profile")
  public async updateProfile(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IUser.IUpdate): Promise<api.IUser> { return AuthProvider.updateProfile({ actor, body }); }
  /** Changes the signed-in user's password and revokes other sessions. @tag Account */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Put("password")
  public async changePassword(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IUser.IChangePassword): Promise<api.IEntity> { return AuthProvider.changePassword({ actor, body }); }
  /** Deactivates the global account and revokes every session. @tag Account */
  @UseGuards(ErpAuthGuard)
  @core.TypedRoute.Put("account/deactivate")
  public async deactivateAccount(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: { currentPassword: string }): Promise<api.IEntity> { return AuthProvider.deactivateAccount({ actor, body }); }
  /** Requests email-bound account recovery without disclosing account existence. @tag Account */
  @core.TypedRoute.Post("recovery/request")
  public async recoveryRequest(@core.TypedBody() body: api.IUser.IRecoveryRequest): Promise<api.IEntity> { return AuthProvider.recoveryRequest({ body }); }
  /** Completes email-bound account recovery and reactivates the global account. @tag Account */
  @core.TypedRoute.Post("recovery/complete")
  public async recoveryComplete(@core.TypedBody() body: api.IUser.IRecoveryComplete): Promise<api.IUser.IAuthorized> { return AuthProvider.recoveryComplete({ body }); }
}
