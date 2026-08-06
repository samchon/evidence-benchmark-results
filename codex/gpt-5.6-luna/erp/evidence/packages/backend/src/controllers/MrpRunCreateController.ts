import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IMrpRun}from"@benchmark/erp-api";import{MrpProvider as P}from"../providers/MrpProvider";@Controller("mrp-run-create")export class MrpRunCreateController{
/**
  * @evidence prisma:mrp_runs Exposes the persisted mrp_runs record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IMrpRun.ICreate):Promise<IMrpRun>{return P.runCreate(h,i);}}
