import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IBomLine}from"@benchmark/erp-api";import{ManufacturingDetailsProvider as P}from"../providers/ManufacturingDetailsProvider";@Controller("bom-line-create")export class BomLineCreateController{
/**
  * @evidence prisma:bom_lines Exposes the persisted bom_lines record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IBomLine.ICreate):Promise<IBomLine>{return P.bomLineCreate(h,i);}}
