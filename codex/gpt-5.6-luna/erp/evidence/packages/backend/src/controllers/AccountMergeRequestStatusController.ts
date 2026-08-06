
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAccountMergeRequest, IAuth } from "@benchmark/erp-api"; import { AccountProvider } from "../providers/AccountProvider";



@Controller("account-merge-request-status") export class AccountMergeRequestStatusController {
  @core.TypedRoute.Post(":id")
  public async status(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() i: IAccountMergeRequest.IStatus): Promise<IAccountMergeRequest> { return AccountProvider.mergeStatus(h, id, i); } }
