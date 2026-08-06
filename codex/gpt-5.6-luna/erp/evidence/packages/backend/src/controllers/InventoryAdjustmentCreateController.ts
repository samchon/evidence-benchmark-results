import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IInventoryAdjustment } from "@benchmark/erp-api"; import { InventoryOperationsProvider } from "../providers/InventoryOperationsProvider";
/** Creates a draft inventory adjustment.
*/ @Controller("inventory-adjustment-create") export class InventoryAdjustmentCreateController {
/**
 * @evidence prisma:inventory_adjustments Exposes the persisted inventory_adjustments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IInventoryAdjustment.ICreate): Promise<IInventoryAdjustment> { return InventoryOperationsProvider.adjustmentCreate(h, input); } }
