
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IReconciliation } from "@benchmark/erp-api"; import { ReconciliationProvider } from "../providers/ReconciliationProvider";


 @Controller("reconciliation-reopen") export class ReconciliationReopenController { /** Reopens a completed reconciliation only after an approved correction request and records the audit event.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-reconciliation-006-reopens-an-approved-reconciliation-with-an-audit-event Reopens an approved reconciliation with an audit event.
 */
  @core.TypedRoute.Post(":id")
  public async reopen(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedParam("id") id: string): Promise<IReconciliation> { return ReconciliationProvider.reopen(headers, id); } }
