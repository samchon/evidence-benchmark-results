import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IEmploymentContract}from"@benchmark/erp-api";import{PeopleProjectProvider as P}from"../providers/PeopleProjectProvider";@Controller("employment-contract-create")export class EmploymentContractCreateController{
/**
  * @evidence prisma:employment_contracts Exposes the persisted employment_contracts record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IEmploymentContract.ICreate):Promise<IEmploymentContract>{return P.contractCreate(h,i);}}
