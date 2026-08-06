import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IBankAccount } from "@benchmark/erp-api"; import { BankProvider } from "../providers/BankProvider";
/** Creates a bank account linked to a ledger account.
*/ @Controller("bank-account-create") export class BankAccountCreateController {
/**
 * @evidence prisma:bank_accounts Exposes the persisted bank_accounts record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IBankAccount.ICreate): Promise<IBankAccount> { return BankProvider.accountCreate(headers, input); } }
