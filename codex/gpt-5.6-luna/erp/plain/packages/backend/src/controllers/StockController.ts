import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { StockProvider } from "../providers/StockProvider";

/** Inventory movement and on-hand projections. */
@Controller("erp/stock")
@UseGuards(ErpAuthGuard)
export class StockController {
  /** Lists immutable stock movements. @tag Inventory */
  @core.TypedRoute.Patch("movement")
  public async movementIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { itemId?: null | string; warehouseId?: null | string; locationId?: null | string; lotId?: null | string; serialCode?: null | string; type?: null | string; sourceType?: null | string; sourceId?: null | string; operatorId?: null | string; from?: null | string; to?: null | string }): Promise<api.IPage<api.IStockMovement>> { return StockProvider.movementIndex({ actor, input }); }
  /** Lists current stock balances derived from movements. @tag Inventory */
  @core.TypedRoute.Patch("balance")
  public async balanceIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { itemId?: null | string; warehouseId?: null | string; locationId?: null | string; lotId?: null | string; serialCode?: null | string; type?: null | string; sourceType?: null | string; sourceId?: null | string; operatorId?: null | string; from?: null | string; to?: null | string }): Promise<api.IPage<api.IStockBalance>> { return StockProvider.balanceIndex({ actor, input }); }
}
