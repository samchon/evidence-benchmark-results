import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IVendor } from "@benchmark/erp-api"; import { PartyProvider } from "../providers/PartyProvider";
/** Creates an external vendor.
*/ @Controller("vendor-create") export class VendorCreateController {
/**
 * @evidence prisma:vendors Exposes the persisted vendors record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IVendor.ICreate): Promise<IVendor> { return PartyProvider.vendorCreate(headers, input); } }
