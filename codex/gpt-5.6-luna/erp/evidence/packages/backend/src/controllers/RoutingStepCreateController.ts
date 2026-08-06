import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IRoutingStep}from"@benchmark/erp-api";import{ManufacturingDetailsProvider as P}from"../providers/ManufacturingDetailsProvider";@Controller("routing-step-create")export class RoutingStepCreateController{
/**
  * @evidence prisma:routing_steps Exposes the persisted routing_steps record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IRoutingStep.ICreate):Promise<IRoutingStep>{return P.routingStepCreate(h,i);}}
