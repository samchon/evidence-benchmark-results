import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IStockMovement } from "@benchmark/erp-api"; import { StockMovementProvider } from "../providers/StockMovementProvider";
/** Records an immutable source-linked stock movement.
*/ @Controller("stock-movement-create") export class StockMovementCreateController {
/**
 * @evidence prisma:stock_movements Exposes the persisted stock_movements record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IStockMovement.ICreate): Promise<IStockMovement> { return StockMovementProvider.create(headers, input); } }
