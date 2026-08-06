import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICustomFieldDefinition } from "@benchmark/erp-api"; import { CustomFieldProvider } from "../providers/CustomFieldProvider";
/** Creates a custom-field definition.
*/ @Controller("custom-field-definition-create") export class CustomFieldDefinitionCreateController {
/**
 * @evidence prisma:custom_field_definitions Exposes the persisted custom_field_definitions record through this operation.
 */
  @core.TypedRoute.Post()
  public async create(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ICustomFieldDefinition.ICreate): Promise<ICustomFieldDefinition> { return CustomFieldProvider.definitionCreate(headers, input); } }
