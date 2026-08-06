import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, ICustomFieldValue, IPage } from "@benchmark/erp-api"; import { CustomFieldProvider } from "../providers/CustomFieldProvider";
/** Lists typed custom-field values on a target record.
*/ @Controller("custom-field-value-search") export class CustomFieldValueIndexController {
/**
 * @evidence prisma:custom_field_values Exposes the persisted custom_field_values record through this operation.
 */
  @core.TypedRoute.Patch()
  public async index(@core.TypedHeaders() headers: IAuth.IHeaders, @core.TypedBody() input: ICustomFieldValue.IRequest): Promise<IPage<ICustomFieldValue>> { return CustomFieldProvider.valueIndex(headers, input); } }
