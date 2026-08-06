import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IBudgetLine,IAuth}from"@benchmark/erp-api";import{FinanceDimensionsProvider as P}from"../providers/FinanceDimensionsProvider";@Controller("budget-line-create")export class BudgetLineCreateController{
/**
  * @evidence prisma:budget_lines Exposes the persisted budget_lines record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IBudgetLine.ICreate):Promise<IBudgetLine>{return P.budgetLineCreate(h,i);}}
