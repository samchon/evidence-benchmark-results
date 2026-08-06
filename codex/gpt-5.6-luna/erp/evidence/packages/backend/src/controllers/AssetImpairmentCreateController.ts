import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAssetImpairment,IAuth}from"@benchmark/erp-api";import{AssetEventsProvider}from"../providers/AssetEventsProvider";@Controller("asset-impairment-create")export class AssetImpairmentCreateController{
/**
  * @evidence prisma:asset_impairments Exposes the persisted asset_impairments record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IAssetImpairment.ICreate):Promise<IAssetImpairment>{return AssetEventsProvider.impairmentCreate(h,i);}}
