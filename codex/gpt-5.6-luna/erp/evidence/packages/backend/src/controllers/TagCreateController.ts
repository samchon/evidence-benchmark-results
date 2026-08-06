import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITag } from "@benchmark/erp-api"; import { TagProvider } from "../providers/TagProvider";
/** Creates organization tags.
*/ @Controller("tag-create") export class TagCreateController {
/**
 * @evidence prisma:tags Exposes the persisted tags record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ITag.ICreate): Promise<ITag> { return TagProvider.create({ headers, input }); } }
