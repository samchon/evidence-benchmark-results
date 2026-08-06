
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAccountMergeRequest, IAuth, IPage } from "@benchmark/erp-api"; import { AccountProvider } from "../providers/AccountProvider";



@Controller("account-merge-request-search") export class AccountMergeRequestIndexController {
  @core.TypedRoute.Patch()
  public async index(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() i: IAccountMergeRequest.IRequest): Promise<IPage<IAccountMergeRequest>> { return AccountProvider.mergeIndex(h, i); } }
