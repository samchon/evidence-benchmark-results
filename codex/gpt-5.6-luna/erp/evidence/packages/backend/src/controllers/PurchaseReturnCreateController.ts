import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IPurchaseReturn}from"@benchmark/erp-api";import{PurchaseReturnProvider as P}from"../providers/PurchaseReturnProvider";@Controller("purchase-return-create")export class PurchaseReturnCreateController{
/**
  * @evidence prisma:purchase_returns Exposes the persisted purchase_returns record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IPurchaseReturn.ICreate):Promise<IPurchaseReturn>{return P.create(h,i);}}
