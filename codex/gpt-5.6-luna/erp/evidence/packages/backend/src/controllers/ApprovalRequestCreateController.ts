import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IApprovalRequest, IAuth } from "@benchmark/erp-api"; import { ApprovalProvider } from "../providers/ApprovalProvider";
/** Starts an approval request for a target record.
*/ @Controller("approval-request-create") export class ApprovalRequestCreateController {
/**
 * @evidence prisma:approval_requests Exposes the persisted approval_requests record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IApprovalRequest.ICreate): Promise<IApprovalRequest> { return ApprovalProvider.requestCreate(h, input); } }
