import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IStorageLocation } from "@benchmark/erp-api"; import { InventoryMasterProvider } from "../providers/InventoryMasterProvider";
/** Creates a bounded-depth storage location.
*/ @Controller("storage-location-create") export class StorageLocationCreateController {
/**
 * @evidence prisma:storage_locations Exposes the persisted storage_locations record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IStorageLocation.ICreate): Promise<IStorageLocation> { return InventoryMasterProvider.locationCreate(headers, input); } }
