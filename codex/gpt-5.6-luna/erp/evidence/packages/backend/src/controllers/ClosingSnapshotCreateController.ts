import * as core from "@nestia/core";import{Controller}from"@nestjs/common";import type{IAuth,IClosingSnapshot}from"@benchmark/erp-api";import{ClosingSnapshotProvider as P}from"../providers/ClosingSnapshotProvider";@Controller("closing-snapshot-create")export class ClosingSnapshotCreateController{
/**
  * @evidence prisma:closing_snapshots Exposes the persisted closing_snapshots record through this operation.
*/
  @core.TypedRoute.Post()public async create(@core.TypedHeaders()h:IAuth.IHeaders,@core.TypedBody()i:IClosingSnapshot.ICreate):Promise<IClosingSnapshot>{return P.create(h,i);}}
