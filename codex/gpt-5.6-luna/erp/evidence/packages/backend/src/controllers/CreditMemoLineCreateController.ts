import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICreditMemoLine } from "@benchmark/erp-api"; import { DocumentLineProvider as P } from "../providers/DocumentLineProvider"; @Controller("credit-memo-line-create") export class CreditMemoLineCreateController {
/**
  * @evidence prisma:credit_memo_lines Exposes the persisted credit_memo_lines record through this operation.
*/
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ICreditMemoLine.ICreate):Promise<ICreditMemoLine>{return P.creditMemoLineCreate(h,i);} }
