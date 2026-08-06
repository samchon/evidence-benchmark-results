import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IInventoryLot } from "@benchmark/erp-api"; import { TraceabilityProvider } from "../providers/TraceabilityProvider";
/** Creates an inventory lot.
*/ @Controller("inventory-lot-create") export class InventoryLotCreateController {
/**
 * @evidence prisma:inventory_lots Exposes the persisted inventory_lots record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IInventoryLot.ICreate): Promise<IInventoryLot> { return TraceabilityProvider.lotCreate(h, input); } }
