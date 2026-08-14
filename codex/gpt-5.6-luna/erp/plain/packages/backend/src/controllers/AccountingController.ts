import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { AccountingProvider } from "../providers/AccountingProvider";

/** Ledger account operations. */
@Controller("erp/account")
@UseGuards(ErpAuthGuard)
export class AccountingController {
  /** Creates a ledger account. @tag Accounting */
  @core.TypedRoute.Post("")
  public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAccount.ICreate): Promise<api.IAccount> { return AccountingProvider.create({ actor, body }); }
  /** Lists active ledger accounts. @tag Accounting */
  @core.TypedRoute.Patch("")
  public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest & { search?: null | string; type?: null | api.IAccount["type"] }): Promise<api.IPage<api.IAccount>> { return AccountingProvider.index({ actor, input }); }
  /** Reads a ledger account. @tag Accounting */
  @core.TypedRoute.Get(":id")
  public async at(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAccount> { return AccountingProvider.at({ actor, id }); }
  /** Updates a ledger account. @tag Accounting */
  @core.TypedRoute.Put(":id")
  public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IAccount.IUpdate): Promise<api.IAccount> { return AccountingProvider.update({ actor, id, body }); }
  /** Deactivates a ledger account. @tag Accounting */
  @core.TypedRoute.Delete(":id")
  public async erase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return AccountingProvider.erase({ actor, id }); }
  @core.TypedRoute.Post(":id/merge-request")
  public async mergeRequest(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IAccount.IMerge): Promise<api.IApproval> { return AccountingProvider.mergeRequest({ actor, id, body }); }
  @core.TypedRoute.Put(":id/merge")
  public async mergeExecute(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAccount> { return AccountingProvider.mergeExecute({ actor, id }); }
}
