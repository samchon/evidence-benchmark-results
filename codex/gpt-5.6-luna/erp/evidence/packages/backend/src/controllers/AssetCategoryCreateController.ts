import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAssetCategory, IAuth } from "@benchmark/erp-api"; import { AssetProvider } from "../providers/AssetProvider";
/** Creates an asset category.
*/ @Controller("asset-category-create") export class AssetCategoryCreateController {
/**
 * @evidence prisma:asset_categories Exposes the persisted asset_categories record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h: IAuth.IHeaders, @core.TypedBody() input: IAssetCategory.ICreate): Promise<IAssetCategory> { return AssetProvider.categoryCreate(h, input); } }
