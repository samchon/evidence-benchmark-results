import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ISalesReturnLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("sales-return-line-create") export class SalesReturnLineCreateController {
/**
  * @evidence prisma:sales_return_lines Exposes the persisted sales_return_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ISalesReturnLine.ICreate):Promise<ISalesReturnLine>{return P.salesReturnLineCreate(h,i);} }
