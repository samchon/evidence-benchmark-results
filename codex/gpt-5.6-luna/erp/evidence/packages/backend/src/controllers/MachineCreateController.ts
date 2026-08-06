import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IMachine}from"@benchmark/erp-api";import{ManufacturingDetailsProvider as P}from"../providers/ManufacturingDetailsProvider";@Controller("machine-create")export class MachineCreateController{
/**
  * @evidence prisma:machines Exposes the persisted machines record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IMachine.ICreate):Promise<IMachine>{return P.machineCreate(h,i);}}
