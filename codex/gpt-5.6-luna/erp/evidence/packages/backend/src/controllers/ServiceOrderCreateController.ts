import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IServiceOrder } from "@benchmark/erp-api"; import { QualityServiceProvider } from "../providers/QualityServiceProvider";
/** Creates a service-order record.
*/ @Controller("service-order-create") export class ServiceOrderCreateController {
/**
 * @evidence prisma:service_orders Exposes the persisted service_orders record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IServiceOrder.ICreate): Promise<IServiceOrder> { return QualityServiceProvider.serviceOrderCreate(h, input); } }
