import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { JournalProvider } from "../providers/JournalProvider";

/** General-ledger journal operations. */
@Controller("erp/journal")
@UseGuards(ErpAuthGuard)
export class JournalController {
  /** Creates a balanced draft journal. @tag Accounting */
  @core.TypedRoute.Post("")
  public async create(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IJournal.ICreate): Promise<api.IJournal> { return JournalProvider.create({ actor, body }); }
  /** Lists journals. @tag Accounting */
  @core.TypedRoute.Patch("")
  public async index(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IPage.IRequest): Promise<api.IPage<api.IJournal>> { return JournalProvider.index({ actor, input }); }
  /** Reads a journal. @tag Accounting */
  @core.TypedRoute.Get(":id")
  public async at(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IJournal> { return JournalProvider.at({ actor, id }); }
  @core.TypedRoute.Put(":id")
  public async update(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IJournal.IUpdate): Promise<api.IJournal> { return JournalProvider.update({ actor, id, body }); }
  @core.TypedRoute.Delete(":id")
  public async erase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return JournalProvider.erase({ actor, id }); }
  /** Posts a balanced journal. @tag Accounting */
  @core.TypedRoute.Put(":id/post")
  public async post(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IJournal> { return JournalProvider.post({ actor, id }); }
  @core.TypedRoute.Put(":id/reverse")
  public async reverse(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IJournal.IReverse): Promise<api.IJournal> { return JournalProvider.reverse({ actor, id, body }); }
  @core.TypedRoute.Put(":id/void")
  public async voidEntry(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IJournal.IReverse): Promise<api.IJournal> { return JournalProvider.voidEntry({ actor, id, body }); }
  @core.TypedRoute.Post(":id/adjust")
  public async adjust(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IJournal.ICreate): Promise<api.IJournal> { return JournalProvider.adjust({ actor, id, body }); }
}
