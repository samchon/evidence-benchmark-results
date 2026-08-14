import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { InteractionProvider } from "../providers/InteractionProvider";

/** Attachments, comments, and tag operations. */
@Controller("erp/interaction")
@UseGuards(ErpAuthGuard)
export class InteractionController {
  @core.TypedRoute.Post("attachment") public async attachmentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IAttachment.ICreate): Promise<api.IAttachment> { return InteractionProvider.attachmentCreate({ actor, body }); }
  @core.TypedRoute.Get("attachment/:targetType/:targetId") public async attachmentIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("targetType") targetType: string, @core.TypedParam("targetId") targetId: string): Promise<api.IAttachment[]> { return InteractionProvider.attachmentIndex({ actor, targetType, targetId }); }
  @core.TypedRoute.Delete("attachment/:id") public async attachmentErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return InteractionProvider.attachmentErase({ actor, id }); }
  @core.TypedRoute.Post("comment") public async commentCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.IComment.ICreate): Promise<api.IComment> { return InteractionProvider.commentCreate({ actor, body }); }
  @core.TypedRoute.Get("comment/:targetType/:targetId") public async commentIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("targetType") targetType: string, @core.TypedParam("targetId") targetId: string): Promise<api.IComment[]> { return InteractionProvider.commentIndex({ actor, targetType, targetId }); }
  @core.TypedRoute.Put("comment/:id") public async commentUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.IComment.IUpdate): Promise<api.IComment> { return InteractionProvider.commentUpdate({ actor, id, body }); }
  @core.TypedRoute.Delete("comment/:id") public async commentErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return InteractionProvider.commentErase({ actor, id }); }
  @core.TypedRoute.Post("tag") public async tagCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ITag.ICreate): Promise<api.ITag> { return InteractionProvider.tagCreate({ actor, body }); }
  @core.TypedRoute.Put("tag/:id") public async tagUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITag.IUpdate): Promise<api.ITag> { return InteractionProvider.tagUpdate({ actor, id, body }); }
  @core.TypedRoute.Post("tag/:id/assign") public async tagAssign(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ITag.IAssign): Promise<api.IEntity> { return InteractionProvider.tagAssign({ actor, id, body }); }
  @core.TypedRoute.Get("tag/:targetType/:targetId") public async tagIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("targetType") targetType: string, @core.TypedParam("targetId") targetId: string): Promise<api.ITag[]> { return InteractionProvider.tagIndex({ actor, targetType, targetId }); }
  @core.TypedRoute.Delete("tag/:id/assign/:targetType/:targetId") public async tagUnassign(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedParam("targetType") targetType: string, @core.TypedParam("targetId") targetId: string): Promise<api.IEntity> { return InteractionProvider.tagUnassign({ actor, id, targetType, targetId }); }
  @core.TypedRoute.Delete("tag/:id") public async tagErase(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IEntity> { return InteractionProvider.tagErase({ actor, id }); }
}
