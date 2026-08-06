import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IBankTransaction } from "@benchmark/erp-api"; import { BankProvider } from "../providers/BankProvider";
/** Records a manual or imported bank transaction in imported state.
*/ @Controller("bank-transaction-create") export class BankTransactionCreateController {
/**
 * @evidence prisma:bank_transactions Exposes the persisted bank_transactions record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IBankTransaction.ICreate): Promise<IBankTransaction> { return BankProvider.transactionCreate(headers, input); } }
