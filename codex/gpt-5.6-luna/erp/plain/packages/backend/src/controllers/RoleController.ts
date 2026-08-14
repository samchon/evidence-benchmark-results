import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { RoleProvider } from "../providers/RoleProvider";

/** Owner-controlled role composition and membership role assignment. */
@Controller("erp/organization/role")
@UseGuards(ErpAuthGuard)
export class RoleController {
  @core.TypedRoute.Post("") public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IRole.ICreate): Promise<api.IRole> { return RoleProvider.create({ actor, body }); }
  @core.TypedRoute.Patch("") public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IRole>> { return RoleProvider.index({ actor, input }); }
  @core.TypedRoute.Put(":id") public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IRole.IUpdate): Promise<api.IRole> { return RoleProvider.update({ actor, id, body }); }
  @core.TypedRoute.Delete(":id") public async erase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return RoleProvider.erase({ actor, id }); }
  @core.TypedRoute.Post("membership/:membershipId") public async assign(@ErpAuth() actor: ErpPayload, @core.TypedParam("membershipId") membershipId: string & tags.Format<"uuid">, @core.TypedBody() body: api.IRole.IAssign): Promise<api.IMembership> { return RoleProvider.assign({ actor, membershipId, body }); }
  @core.TypedRoute.Delete("membership/:membershipId/:roleId") public async revoke(@ErpAuth() actor: ErpPayload, @core.TypedParam("membershipId") membershipId: string & tags.Format<"uuid">, @core.TypedParam("roleId") roleId: string & tags.Format<"uuid">): Promise<api.IMembership> { return RoleProvider.revoke({ actor, membershipId, roleId }); }
}
