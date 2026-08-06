import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IBudget,IAuth}from"@benchmark/erp-api";import{FinanceDimensionsProvider as P}from"../providers/FinanceDimensionsProvider";@Controller("budget-create")export class BudgetCreateController{
/**
  * @evidence prisma:budgets Exposes the persisted budgets record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IBudget.ICreate):Promise<IBudget>{return P.budgetCreate(h,i);}}
