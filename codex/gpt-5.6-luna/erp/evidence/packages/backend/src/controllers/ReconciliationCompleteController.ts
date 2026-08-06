import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IReconciliation } from "@benchmark/erp-api"; import { ReconciliationProvider } from "../providers/ReconciliationProvider";
/** Completes a balanced reconciliation and marks included lines reconciled.
*/ @Controller("reconciliation-complete") export class ReconciliationCompleteController {
/**
 * @evidence prisma:reconciliations Exposes the persisted reconciliations record through this operation.
 */
  @core.TypedRoute.Post(":id")
  public async complete(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IReconciliation> { return ReconciliationProvider.complete(headers, id); } }
