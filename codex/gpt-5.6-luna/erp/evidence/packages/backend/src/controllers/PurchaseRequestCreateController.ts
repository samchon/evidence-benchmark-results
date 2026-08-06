import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IPurchaseRequest } from "@benchmark/erp-api"; import { ProcurementProvider } from "../providers/ProcurementProvider";
/** Creates a draft employee purchase request.
*/ @Controller("purchase-request-create") export class PurchaseRequestCreateController {
/**
 * @evidence prisma:purchase_requests Exposes the persisted purchase_requests record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IPurchaseRequest.ICreate): Promise<IPurchaseRequest> { return ProcurementProvider.requestCreate(h, input); } }
