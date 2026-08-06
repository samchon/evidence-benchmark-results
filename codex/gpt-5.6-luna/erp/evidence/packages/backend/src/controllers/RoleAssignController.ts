import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IRole, IMembership } from "@benchmark/erp-api"; import { RoleProvider } from "../providers/RoleProvider";
/** Assigns a role to an active organization member.
*/ @Controller("role-assign") export class RoleAssignController {
/**
 * @evidence prisma:roles Exposes the persisted roles record through this operation.
 */
  @core.TypedRoute.Post()
  public async assign(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IRole.IAssign): Promise<IMembership> { return RoleProvider.assign(headers, input); } }
