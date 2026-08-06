
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAccountMergeRequest, IAuth } from "@benchmark/erp-api"; import { AccountProvider } from "../providers/AccountProvider";



@Controller("account-merge-request-apply") export class AccountMergeRequestApplyController {
/** @evidence prisma:account_merge_requests Exposes the persisted account_merge_requests record through this operation.
*/
  @core.TypedRoute.Post(":id")
  public async apply(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IAccountMergeRequest> { return AccountProvider.mergeApply(h, id); } }
