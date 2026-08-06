import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IApprovalWorkflow, IAuth } from "@benchmark/erp-api"; import { ApprovalProvider } from "../providers/ApprovalProvider";
/** Creates an approval workflow definition.
*/ @Controller("approval-workflow-create") export class ApprovalWorkflowCreateController {
/**
 * @evidence prisma:approval_workflows Exposes the persisted approval_workflows record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IApprovalWorkflow.ICreate): Promise<IApprovalWorkflow> { return ApprovalProvider.workflowCreate(h, input); } }
