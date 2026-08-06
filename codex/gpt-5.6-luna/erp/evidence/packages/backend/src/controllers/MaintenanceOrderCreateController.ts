import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IMaintenanceOrder } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a maintenance-order record.
*/ @Controller("maintenance-order-create") export class MaintenanceOrderCreateController {
/**
 * @evidence prisma:maintenance_orders Exposes the persisted maintenance_orders record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IMaintenanceOrder.ICreate): Promise<IMaintenanceOrder> { return QualityServiceProvider.maintenanceOrderCreate(h, input); } }
