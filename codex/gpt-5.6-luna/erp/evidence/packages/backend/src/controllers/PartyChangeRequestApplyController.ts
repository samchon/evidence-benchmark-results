import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPartyChangeRequest } from "@benchmark/erp-api"; import { PartyChangeProvider } from "../providers/PartyChangeProvider";
/** Applies an approved party master change and emits audit evidence.
*/ @Controller("party-change-request-apply") export class PartyChangeRequestApplyController {
/**
 * @evidence prisma:party_change_requests Exposes the persisted party_change_requests record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async apply(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<IPartyChangeRequest>{return PartyChangeProvider.apply(h,id);} }
