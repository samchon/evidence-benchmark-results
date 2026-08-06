import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ITagAssignment } from "@benchmark/erp-api"; import { TagAssignmentProvider as P } from "../providers/TagAssignmentProvider";
/** Assigns an active tag to a business record.
*/ @Controller("tag-assignment-create") export class TagAssignmentCreateController {
/**
 * @evidence prisma:tag_assignments Exposes the persisted tag_assignments record through this operation.
 * @evidence prisma:tags Exposes the persisted tags record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedBody() i:ITagAssignment.ICreate):Promise<ITagAssignment>{return P.create(h,i);} }
