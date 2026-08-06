import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAssetDisposal,IAuth}from"@benchmark/erp-api";import{AssetEventsProvider}from"../providers/AssetEventsProvider";@Controller("asset-disposal-create")export class AssetDisposalCreateController{
/**
  * @evidence prisma:asset_disposals Exposes the persisted asset_disposals record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IAssetDisposal.ICreate):Promise<IAssetDisposal>{return AssetEventsProvider.disposalCreate(h,i);}}
