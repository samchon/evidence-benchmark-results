import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { BankReconciliationProvider } from "../providers/BankReconciliationProvider";

/** Bank transaction and reconciliation operations. */
@Controller("erp/bank")
@UseGuards(ErpAuthGuard)
export class BankReconciliationController {
  @core.TypedRoute.Post("transaction") public async transactionCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IBankTransaction.ICreate): Promise<api.IBankTransaction> { return BankReconciliationProvider.transactionCreateSafe({ actor, body }); }
  @core.TypedRoute.Post("transaction/import") public async transactionImport(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IBankTransaction.IImport): Promise<api.IBankTransaction[]> { return BankReconciliationProvider.transactionImportSafe({ actor, body }); }
  @core.TypedRoute.Patch("transaction") public async transactionIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IBankTransaction.IIndex): Promise<api.IPage<api.IBankTransaction>> { return BankReconciliationProvider.transactionIndex({ actor, input }); }
  @core.TypedRoute.Put("transaction/:id/match") public async transactionMatch(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IBankTransaction.IMatch): Promise<api.IBankTransaction> { return BankReconciliationProvider.transactionMatch({ actor, id, body }); }
  @core.TypedRoute.Put("transaction/:id/:status") public async transactionResolve(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("status") status: "matched" | "ignored"): Promise<api.IBankTransaction> { return BankReconciliationProvider.transactionResolve({ actor, id, status }); }
  @core.TypedRoute.Post("reconciliation") public async reconciliationCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IReconciliation.ICreate): Promise<api.IReconciliation> { return BankReconciliationProvider.reconciliationCreateSafe({ actor, body }); }
  @core.TypedRoute.Post("reconciliation/:id/line") public async reconciliationLine(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IReconciliation.ILineCreate): Promise<api.IReconciliation> { return BankReconciliationProvider.reconciliationLine({ actor, id, body }); }
  @core.TypedRoute.Put("reconciliation/:id/complete") public async reconciliationComplete(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IReconciliation> { return BankReconciliationProvider.reconciliationComplete({ actor, id }); }
  @core.TypedRoute.Put("reconciliation/:id/reopen") public async reconciliationReopen(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IReconciliation> { return BankReconciliationProvider.reconciliationReopenSafe({ actor, id }); }
  @core.TypedRoute.Post("reconciliation/:id/reopen-request") public async reconciliationReopenRequest(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IReconciliation.IReopenRequest): Promise<api.IApproval> { return BankReconciliationProvider.reconciliationReopenRequest({ actor, id, body }); }
}
