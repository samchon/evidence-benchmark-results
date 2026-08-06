import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IItemSerial } from "@benchmark/erp-api"; import { TraceabilityProvider } from "../providers/TraceabilityProvider";
/** Creates a physical item serial.
*/ @Controller("item-serial-create") export class ItemSerialCreateController {
/**
 * @evidence prisma:item_serials Exposes the persisted item_serials record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IItemSerial.ICreate): Promise<IItemSerial> { return TraceabilityProvider.serialCreate(h, input); } }
