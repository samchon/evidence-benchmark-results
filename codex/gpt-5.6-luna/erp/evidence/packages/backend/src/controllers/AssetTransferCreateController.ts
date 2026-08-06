import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAssetTransfer,IAuth}from"@benchmark/erp-api";import{AssetEventsProvider}from"../providers/AssetEventsProvider";@Controller("asset-transfer-create")export class AssetTransferCreateController{
/**
 * @evidence prisma:asset_transfers Exposes the persisted asset_transfers record through this operation.
 * @evidence prisma:transfers Exposes the persisted transfers record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IAssetTransfer.ICreate):Promise<IAssetTransfer>{return AssetEventsProvider.transferCreate(h,i);}}
