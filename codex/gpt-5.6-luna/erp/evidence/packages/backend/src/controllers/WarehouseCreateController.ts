import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IWarehouse } from "@benchmark/erp-api"; import { InventoryMasterProvider } from "../providers/InventoryMasterProvider";
/** Creates a warehouse.
*/ @Controller("warehouse-create") export class WarehouseCreateController {
/**
 * @evidence prisma:warehouses Exposes the persisted warehouses record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IWarehouse.ICreate): Promise<IWarehouse> { return InventoryMasterProvider.warehouseCreate(headers, input); } }
