import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { tags } from "typia";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { CustomFieldProvider } from "../providers/CustomFieldProvider";

/** Custom-field definition and value operations. */
@Controller("erp/custom-field")
@UseGuards(ErpAuthGuard)
export class CustomFieldController {
  @core.TypedRoute.Post("definition") public async definitionCreate(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICustomFieldDefinition.ICreate): Promise<api.ICustomFieldDefinition> { return CustomFieldProvider.definitionCreate({ actor, body }); }
  @core.TypedRoute.Patch("definition") public async definitionIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.ICustomFieldDefinition.IIndex): Promise<api.IPage<api.ICustomFieldDefinition>> { return CustomFieldProvider.definitionIndex({ actor, input }); }
  @core.TypedRoute.Put("definition/:id") public async definitionUpdate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">, @core.TypedBody() body: api.ICustomFieldDefinition.IUpdate): Promise<api.ICustomFieldDefinition> { return CustomFieldProvider.definitionUpdate({ actor, id, body }); }
  @core.TypedRoute.Put("definition/:id/deactivate") public async definitionDeactivate(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.ICustomFieldDefinition> { return CustomFieldProvider.definitionDeactivate({ actor, id }); }
  @core.TypedRoute.Put("value") public async valueSet(@ErpAuth() actor: ErpPayload, @core.TypedBody() body: api.ICustomFieldValue.ISet): Promise<api.ICustomFieldValue> { return CustomFieldProvider.valueSet({ actor, body }); }
  @core.TypedRoute.Get("value/:targetType/:targetId") public async valueIndex(@ErpAuth() actor: ErpPayload, @core.TypedParam("targetType") targetType: string, @core.TypedParam("targetId") targetId: string & tags.Format<"uuid">): Promise<api.ICustomFieldValue[]> { return CustomFieldProvider.valueIndex({ actor, targetType, targetId }); }
}
