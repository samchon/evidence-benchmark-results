import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IMrpRecommendation}from"@benchmark/erp-api";import{MrpProvider as P}from"../providers/MrpProvider";@Controller("mrp-recommendation-create")export class MrpRecommendationCreateController{
/**
  * @evidence prisma:mrp_recommendations Exposes the persisted mrp_recommendations record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IMrpRecommendation.ICreate):Promise<IMrpRecommendation>{return P.recommendationCreate(h,i);}}
