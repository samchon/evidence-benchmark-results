import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ExtendedFinanceProvider } from "../providers/ExtendedFinanceProvider";

/** Vendor bills, purchase returns, sales returns, and credit memos. */
@Controller("erp/extended-finance")
@UseGuards(ErpAuthGuard)
export class ExtendedFinanceController {
  @core.TypedRoute.Post("vendor-bill") public async billCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IVendorBill.ICreate): Promise<api.IVendorBill> { return ExtendedFinanceProvider.billCreate({ actor, body }); }
  @core.TypedRoute.Patch("vendor-bill") public async billIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IVendorBill>> { return ExtendedFinanceProvider.billIndex({ actor, input }); }
  @core.TypedRoute.Put("vendor-bill/:id") public async billUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IVendorBill.IUpdate): Promise<api.IVendorBill> { return ExtendedFinanceProvider.billUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("vendor-bill/:id/post") public async billPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IVendorBill> { return ExtendedFinanceProvider.billPost({ actor, id }); }
  @core.TypedRoute.Post("vendor-bill/:id/match") public async billMatch(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IVendorBillMatch> { return ExtendedFinanceProvider.billMatch({ actor, id }); }
  @core.TypedRoute.Put("vendor-bill/:id/:status") public async billTransition(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "approved" | "rejected" | "disputed"): Promise<api.IVendorBill> { return ExtendedFinanceProvider.billTransition({ actor, id, status }); }
  @core.TypedRoute.Post("purchase-return") public async purchaseReturnCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IPurchaseReturn.ICreate): Promise<api.IPurchaseReturn> { return ExtendedFinanceProvider.purchaseReturnCreate({ actor, body }); }
  @core.TypedRoute.Put("purchase-return/:id/post") public async purchaseReturnPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IPurchaseReturn> { return ExtendedFinanceProvider.purchaseReturnPost({ actor, id }); }
  @core.TypedRoute.Post("sales-return") public async salesReturnCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ISalesReturn.ICreate): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnCreate({ actor, body }); }
  @core.TypedRoute.Put("sales-return/:id") public async salesReturnUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesReturn.IUpdate): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("sales-return/:id/approve") public async salesReturnApprove(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnApprove({ actor, id }); }
  @core.TypedRoute.Put("sales-return/:id/reject") public async salesReturnReject(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnReject({ actor, id }); }
  @core.TypedRoute.Put("sales-return/:id/receive") public async salesReturnReceive(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnReceive({ actor, id }); }
  @core.TypedRoute.Put("sales-return/:id/refund") public async salesReturnRefund(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ISalesReturn.IRefund): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnRefund({ actor, id, body }); }
  @core.TypedRoute.Put("sales-return/:id/cancel") public async salesReturnCancel(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ISalesReturn> { return ExtendedFinanceProvider.salesReturnCancel({ actor, id }); }
  @core.TypedRoute.Post("credit-memo") public async creditMemoCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICreditMemo.ICreate): Promise<api.ICreditMemo> { return ExtendedFinanceProvider.creditMemoCreate({ actor, body }); }
  @core.TypedRoute.Patch("credit-memo") public async creditMemoIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.ICreditMemo>> { return ExtendedFinanceProvider.creditMemoIndex({ actor, input }); }
  @core.TypedRoute.Put("credit-memo/:id/post") public async creditMemoPost(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICreditMemo> { return ExtendedFinanceProvider.creditMemoPost({ actor, id }); }
  @core.TypedRoute.Put("credit-memo/:id/apply") public async creditMemoApply(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICreditMemo.IApply): Promise<api.ICreditMemo> { return ExtendedFinanceProvider.creditMemoApply({ actor, id, body }); }
  @core.TypedRoute.Put("credit-memo/:id/refund") public async creditMemoRefund(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICreditMemo.IRefundRequest): Promise<api.ICreditMemo> { return ExtendedFinanceProvider.creditMemoRefund({ actor, id, body }); }
  @core.TypedRoute.Put("credit-memo/:id/void") public async creditMemoVoid(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICreditMemo> { return ExtendedFinanceProvider.creditMemoVoid({ actor, id }); }
}
