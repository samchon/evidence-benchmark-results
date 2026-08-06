import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IDocumentNumber } from "@benchmark/erp-api"; import { AccountingSetupProvider } from "../providers/AccountingSetupProvider";
/** Creates a document number sequence.
*/ @Controller("document-number-create") export class DocumentNumberCreateController {
/**
 * @evidence prisma:document_number_sequences Exposes the persisted document_number_sequences record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IDocumentNumber.ICreate): Promise<IDocumentNumber> { return AccountingSetupProvider.numberCreate(headers, input); } }
