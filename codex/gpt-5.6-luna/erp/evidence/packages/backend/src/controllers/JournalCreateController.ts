import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IJournal } from "@benchmark/erp-api"; import { JournalProvider } from "../providers/JournalProvider";
/** Creates a balanced draft journal.
*/ @Controller("journal-create") export class JournalCreateController {
/**
 * @evidence prisma:journal_lines Exposes the persisted journal_lines record through this operation.
 * @evidence prisma:journal_entries Exposes the persisted journal_entries record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IJournal.ICreate): Promise<IJournal> { return JournalProvider.create(headers, input); } }
