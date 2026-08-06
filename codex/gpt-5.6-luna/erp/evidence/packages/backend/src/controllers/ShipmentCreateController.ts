import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IShipment } from "@benchmark/erp-api"; import { SalesFulfillmentProvider } from "../providers/SalesFulfillmentProvider"; @Controller("shipment-create") export class ShipmentCreateController {
/**
  * @evidence prisma:shipments Exposes the persisted shipments record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IShipment.ICreate):Promise<IShipment>{return SalesFulfillmentProvider.shipmentCreate(h,i);} }
