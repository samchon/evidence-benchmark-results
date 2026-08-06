import type { tags } from "typia";
import type { IPage } from "../typings";
/** Organization-wide custom-field definition. */
/**
 * @evidence prisma:custom_field_definitions Exposes the persisted custom_field_definitions record.
 */
export interface ICustomFieldDefinition {
  /** @evidence prisma:custom_field_definitions.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:custom_field_definitions.target_concept Carries the persisted targetConcept value. */
  targetConcept: string;
  /** @evidence prisma:custom_field_definitions.label Carries the persisted label value. */
  label: string;
  /** @evidence prisma:custom_field_definitions.value_kind Carries the persisted valueKind value. */
  valueKind: string;
  /** @evidence prisma:custom_field_definitions.active Carries the persisted active value. */
  active: boolean;
  /** @evidence prisma:custom_field_definitions.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
  /** @evidence prisma:custom_field_definitions.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace ICustomFieldDefinition { export interface ICreate { targetConcept: string & tags.MinLength<1>; label: string & tags.MinLength<1>; valueKind: "text" | "number" | "boolean" | "date"; } export interface IUpdate { label?: string; valueKind?: "text" | "number" | "boolean" | "date"; } export interface IRequest extends IPage.IRequest { targetConcept?: string; search?: string; includeInactive?: boolean; } }
