import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICycleCount } from "@benchmark/erp-api"; import { InventoryOperationsProvider } from "../providers/InventoryOperationsProvider";
/** Creates a draft cycle count.
*/ @Controller("cycle-count-create") export class CycleCountCreateController {
/**
 * @evidence prisma:cycle_counts Exposes the persisted cycle_counts record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: ICycleCount.ICreate): Promise<ICycleCount> { return InventoryOperationsProvider.countCreate(h, input); } }
