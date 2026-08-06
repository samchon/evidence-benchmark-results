import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IBudgetRevision } from "@benchmark/erp-api"; import { FinanceDimensionsProvider } from "../providers/FinanceDimensionsProvider";
/** Creates a reasoned corrective budget revision.
*/ @Controller("budget-revision-create") export class BudgetRevisionCreateController {
/**
 * @evidence prisma:budget_revisions Exposes the persisted budget_revisions record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:IBudgetRevision.ICreate):Promise<IBudgetRevision>{return FinanceDimensionsProvider.budgetRevisionCreate(h,i);} }
