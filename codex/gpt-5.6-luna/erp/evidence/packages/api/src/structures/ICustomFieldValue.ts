import type { tags } from "typia";
import type { IPage } from "../typings";
/** Concrete value assigned to one custom-field definition and target. */
/**
 * @evidence prisma:custom_field_values Exposes the persisted custom_field_values record.
 */
export interface ICustomFieldValue {
  /** @evidence prisma:custom_field_values.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:custom_field_values.definition_id Carries the persisted definitionId value. */
  definitionId: string & tags.Format<"uuid">;
  /** @evidence prisma:custom_field_values.target_type Carries the persisted targetType value. */
  targetType: string;
  /** @evidence prisma:custom_field_values.target_id Carries the persisted targetId value. */
  targetId: string & tags.Format<"uuid">;
  /** @evidence prisma:custom_field_values.value_text Carries the persisted valueText value. */
  valueText: null | string;
  /** @evidence prisma:custom_field_values.value_number Carries the persisted valueNumber value. */
  valueNumber: null | number;
  /** @evidence prisma:custom_field_values.value_boolean Carries the persisted valueBoolean value. */
  valueBoolean: null | boolean;
  /** @evidence prisma:custom_field_values.value_date Carries the persisted valueDate value. */
  valueDate: null | (string & tags.Format<"date-time">);
  /** @evidence prisma:custom_field_values.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:custom_field_values.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomFieldValue { export interface ISet { definitionId: string & tags.Format<"uuid">; targetType: string & tags.MinLength<1>; targetId: string & tags.Format<"uuid">; valueText?: null | string; valueNumber?: null | number; valueBoolean?: null | boolean; valueDate?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { targetType: string; targetId: string; } }
