
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAccountMergeRequest, IAuth } from "@benchmark/erp-api"; import { AccountProvider } from "../providers/AccountProvider";



@Controller("account-merge-request-create") export class AccountMergeRequestCreateController {
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() i: IAccountMergeRequest.ICreate): Promise<IAccountMergeRequest> { return AccountProvider.mergeCreate(h, i); } }
