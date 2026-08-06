import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IComment } from "@benchmark/erp-api"; import { CollaborationProvider } from "../providers/CollaborationProvider";
/** Adds a comment to a visible target.
*/ @Controller("comment-create") export class CommentCreateController {
/**
 * @evidence prisma:comments Exposes the persisted comments record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: IComment.ICreate): Promise<IComment> { return CollaborationProvider.commentCreate(headers, input); } }
