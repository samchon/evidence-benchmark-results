import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IShipmentLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("shipment-line-create") export class ShipmentLineCreateController {
/**
  * @evidence prisma:shipment_lines Exposes the persisted shipment_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IShipmentLine.ICreate):Promise<IShipmentLine>{return P.shipmentLineCreate(h,i);} }
