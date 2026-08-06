import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAttachment, IAuth } from "@benchmark/erp-api"; import { CollaborationProvider } from "../providers/CollaborationProvider";
/** Adds attachment metadata for a visible target.
*/ @Controller("attachment-create") export class AttachmentCreateController {
/**
 * @evidence prisma:attachments Exposes the persisted attachments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IAttachment.ICreate): Promise<IAttachment> { return CollaborationProvider.attachmentCreate(headers, input); } }
