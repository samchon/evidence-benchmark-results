import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAllocationRule,IAuth}from"@benchmark/erp-api";import{AllocationRuleProvider as P}from"../providers/AllocationRuleProvider";@Controller("allocation-rule-create")export class AllocationRuleCreateController{
/**
  * @evidence prisma:allocation_rules Exposes the persisted allocation_rules record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IAllocationRule.ICreate):Promise<IAllocationRule>{return P.create(h,i);}}
