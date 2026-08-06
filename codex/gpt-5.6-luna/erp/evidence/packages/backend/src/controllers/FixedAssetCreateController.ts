import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IFixedAsset } from "@benchmark/erp-api"; import { AssetProvider } from "../providers/AssetProvider";
/** Registers a fixed asset.
*/ @Controller("fixed-asset-create") export class FixedAssetCreateController {
/**
 * @evidence prisma:fixed_assets Exposes the persisted fixed_assets record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IFixedAsset.ICreate): Promise<IFixedAsset> { return AssetProvider.assetCreate(h, input); } }
