import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IProfitCenter,IAuth}from"@benchmark/erp-api";import{FinanceDimensionsProvider as P}from"../providers/FinanceDimensionsProvider";@Controller("profit-center-create")export class ProfitCenterCreateController{
/**
  * @evidence prisma:profit_centers Exposes the persisted profit_centers record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IProfitCenter.ICreate):Promise<IProfitCenter>{return P.profitCreate(h,i);}}
