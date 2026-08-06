import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseRequestLine } from "@benchmark/erp-api"; import { ProcurementProvider } from "../providers/ProcurementProvider";
/** Adds a line to an editable purchase request.
*/ @Controller("purchase-request-line") export class PurchaseRequestLineController {
/**
 * @evidence prisma:purchase_request_lines Exposes the persisted purchase_request_lines record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedParam("id") id: string, @core.TypedBody() input: IPurchaseRequestLine.ICreate): Promise<IPurchaseRequestLine> { return ProcurementProvider.requestLineCreate(h, id, input); } }
