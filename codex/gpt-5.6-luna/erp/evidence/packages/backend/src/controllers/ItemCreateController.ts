import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IItem } from "@benchmark/erp-api"; import { InventoryMasterProvider } from "../providers/InventoryMasterProvider";
/** Creates an inventory item.
*/ @Controller("item-create") export class ItemCreateController {
/**
 * @evidence prisma:items Exposes the persisted items record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IItem.ICreate): Promise<IItem> { return InventoryMasterProvider.itemCreate(headers, input); } }
