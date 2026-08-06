import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAccount, IAuth } from "@benchmark/erp-api"; import { AccountProvider } from "../providers/AccountProvider";
/** Creates a ledger account. */
@Controller("account-create")
export class AccountCreateController {
/**
   * @evidence prisma:accounts Exposes the persisted accounts record through this operation.
   */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IAccount.ICreate): Promise<IAccount> {
    return AccountProvider.create(headers, input);
  }
}
