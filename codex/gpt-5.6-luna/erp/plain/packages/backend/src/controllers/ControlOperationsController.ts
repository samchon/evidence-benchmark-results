import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ControlOperationsProvider } from "../providers/ControlOperationsProvider";

/** Fiscal close, approvals, bank accounts, and notifications. */
@Controller("erp/control-ops")
@UseGuards(ErpAuthGuard)
export class ControlOperationsController {
  @core.TypedRoute.Post("period") public async periodCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IFiscalPeriod.ICreate): Promise<api.IFiscalPeriod> { return ControlOperationsProvider.periodCreate({ actor, body }); }
  @core.TypedRoute.Patch("period") public async periodIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IFiscalPeriod>> { return ControlOperationsProvider.periodIndex({ actor, input }); }
  @core.TypedRoute.Get("period/:id/validate") public async periodValidate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IFiscalPeriodValidation> { return ControlOperationsProvider.periodValidate({ actor, id }); }
  @core.TypedRoute.Put("period/:id/soft-close") public async periodSoftClose(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IFiscalPeriod> { return ControlOperationsProvider.periodSoftClose({ actor, id }); }
  @core.TypedRoute.Put("period/:id/hard-close") public async periodHardClose(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IFiscalPeriod> { return ControlOperationsProvider.periodHardClose({ actor, id }); }
  @core.TypedRoute.Put("period/:id/reopen") public async periodReopen(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IFiscalPeriod> { return ControlOperationsProvider.periodReopenApproved({ actor, id }); }
  @core.TypedRoute.Post("period/:id/reopen-request") public async periodReopenRequest(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IFiscalPeriod.IReopenRequest): Promise<api.IApproval> { return ControlOperationsProvider.periodReopenRequest({ actor, id, body }); }
  @core.TypedRoute.Get("period/:id/snapshot/:kind") public async periodSnapshot(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("kind") kind: api.IClosingSnapshot.IKind): Promise<api.IClosingSnapshot> { return ControlOperationsProvider.periodSnapshot({ actor, id, kind }); }
  @core.TypedRoute.Post("workflow") public async workflowCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IWorkflow.ICreate): Promise<api.IWorkflow> { return ControlOperationsProvider.workflowCreate({ actor, body }); }
  @core.TypedRoute.Patch("workflow") public async workflowIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IWorkflow>> { return ControlOperationsProvider.workflowIndex({ actor, input }); }
  @core.TypedRoute.Put("workflow/:id") public async workflowUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IWorkflow.IUpdate): Promise<api.IWorkflow> { return ControlOperationsProvider.workflowUpdate({ actor, id, body }); }
  @core.TypedRoute.Post("approval") public async approvalCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IApproval.ICreate): Promise<api.IApproval> { return ControlOperationsProvider.approvalCreate({ actor, body }); }
  @core.TypedRoute.Patch("approval") public async approvalIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IApproval>> { return ControlOperationsProvider.approvalIndex({ actor, input }); }
  @core.TypedRoute.Put("approval/:id/delegate") public async approvalDelegate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: { delegateTo: string }): Promise<api.IApproval> { return ControlOperationsProvider.approvalDelegate({ actor, id, delegateTo: body.delegateTo }); }
  @core.TypedRoute.Put("approval/:id/escalate") public async approvalEscalate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IApproval> { return ControlOperationsProvider.approvalEscalate({ actor, id }); }
  @core.TypedRoute.Get("approval/:id/history") public async approvalHistory(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IApprovalHistory[]> { return ControlOperationsProvider.approvalHistory({ actor, id }); }
  @core.TypedRoute.Put("approval/:id/:action") public async approvalResolve(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("action") action: "approved" | "rejected" | "changes", @core.TypedBody() body: { reason?: null | string }): Promise<api.IApproval> { return ControlOperationsProvider.approvalResolve({ actor, id, action, reason: body.reason }); }
  @core.TypedRoute.Post("bank-account") public async bankCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IBankAccount.ICreate): Promise<api.IBankAccount> { return ControlOperationsProvider.bankCreate({ actor, body }); }
  @core.TypedRoute.Patch("bank-account") public async bankIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IBankAccount>> { return ControlOperationsProvider.bankIndex({ actor, input }); }
  @core.TypedRoute.Put("bank-account/:id") public async bankUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IBankAccount.IUpdate): Promise<api.IBankAccount> { return ControlOperationsProvider.bankUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("bank-account/:id") public async bankErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return ControlOperationsProvider.bankErase({ actor, id }); }
  @core.TypedRoute.Patch("notification") public async notificationIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.INotification>> { return ControlOperationsProvider.notificationIndex({ actor, input }); }
  @core.TypedRoute.Put("notification/:id/dispatch") public async notificationDispatch(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.INotification> { return ControlOperationsProvider.notificationDispatch({ actor, id }); }
  @core.TypedRoute.Put("notification/:id/retry") public async notificationRetry(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.INotification> { return ControlOperationsProvider.notificationRetry({ actor, id }); }
}
