import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IRouting } from "@benchmark/erp-api"; import { ManufacturingProvider } from "../providers/ManufacturingProvider";
/** Creates a draft routing.
*/ @Controller("routing-create") export class RoutingCreateController {
/**
 * @evidence prisma:routings Exposes the persisted routings record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IRouting.ICreate): Promise<IRouting> { return ManufacturingProvider.routingCreate(h, input); } }
