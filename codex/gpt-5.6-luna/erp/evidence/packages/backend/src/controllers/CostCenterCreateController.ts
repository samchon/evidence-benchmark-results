import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{ICostCenter,IAuth}from"@benchmark/erp-api";import{FinanceDimensionsProvider as P}from"../providers/FinanceDimensionsProvider";@Controller("cost-center-create")export class CostCenterCreateController{
/**
  * @evidence prisma:cost_centers Exposes the persisted cost_centers record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:ICostCenter.ICreate):Promise<ICostCenter>{return P.costCreate(h,i);}}
