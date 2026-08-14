import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Organization-scoped custom-field definitions and target values. */
export namespace CustomFieldProvider {
  export async function definitionCreate(p: { actor: ErpPayload; body: api.ICustomFieldDefinition.ICreate }): Promise<api.ICustomFieldDefinition> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    try {
      return definition(await MyGlobal.prisma.custom_field_definitions.create({ data: { id: randomUUID(), organization_id: organizationId, target_type: p.body.targetType, key: p.body.key, label: p.body.label, value_kind: p.body.valueKind, active: true, created_at: new Date(), updated_at: new Date() } }));
    } catch { throw ErrorUtil.conflict("A custom-field key already exists for this target type."); }
  }
  export async function definitionIndex(p: { actor: ErpPayload; input: api.ICustomFieldDefinition.IIndex }): Promise<api.IPage<api.ICustomFieldDefinition>> {
    const organizationId = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit ?? 100; const where = { organization_id: organizationId, ...(p.input.targetType === undefined ? {} : { target_type: p.input.targetType }) }; const [records, rows] = await Promise.all([MyGlobal.prisma.custom_field_definitions.count({ where }), MyGlobal.prisma.custom_field_definitions.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "asc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(definition) };
  }
  export async function definitionUpdate(p: { actor: ErpPayload; id: string; body: api.ICustomFieldDefinition.IUpdate }): Promise<api.ICustomFieldDefinition> {
    const organizationId = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.custom_field_definitions.findFirst({ where: { id: p.id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No custom-field definition exists in the active organization."); return definition(await MyGlobal.prisma.custom_field_definitions.update({ where: { id: row.id }, data: { label: p.body.label ?? row.label, value_kind: p.body.valueKind ?? row.value_kind, updated_at: new Date() } }));
  }
  export async function definitionDeactivate(p: { actor: ErpPayload; id: string }): Promise<api.ICustomFieldDefinition> {
    const organizationId = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.custom_field_definitions.findFirst({ where: { id: p.id, organization_id: organizationId } }); if (row === null) throw ErrorUtil.notFound("No custom-field definition exists in the active organization."); return definition(await MyGlobal.prisma.custom_field_definitions.update({ where: { id: row.id }, data: { active: false, updated_at: new Date() } }));
  }
  export async function valueSet(p: { actor: ErpPayload; body: api.ICustomFieldValue.ISet }): Promise<api.ICustomFieldValue> {
    const organizationId = await AuthProvider.organizationId(p.actor); const definitionRow = await MyGlobal.prisma.custom_field_definitions.findFirst({ where: { id: p.body.definitionId, organization_id: organizationId, target_type: p.body.targetType, active: true } }); if (definitionRow === null) throw ErrorUtil.conflict("Only an active definition for the target type can receive a value."); const now = new Date(); const existing = await MyGlobal.prisma.custom_field_values.findFirst({ where: { definition_id: definitionRow.id, target_type: p.body.targetType, target_id: p.body.targetId, organization_id: organizationId } }); if (existing === null) return value(await MyGlobal.prisma.custom_field_values.create({ data: { id: randomUUID(), organization_id: organizationId, definition_id: definitionRow.id, target_type: p.body.targetType, target_id: p.body.targetId, value: p.body.value, created_at: now, updated_at: now } })); return value(await MyGlobal.prisma.custom_field_values.update({ where: { id: existing.id }, data: { value: p.body.value, updated_at: now } }));
  }
  export async function valueIndex(p: { actor: ErpPayload; targetType: string; targetId: string }): Promise<api.ICustomFieldValue[]> { const organizationId = await AuthProvider.organizationId(p.actor); return (await MyGlobal.prisma.custom_field_values.findMany({ where: { organization_id: organizationId, target_type: p.targetType, target_id: p.targetId }, orderBy: { created_at: "asc" } })).map(value); }
  function definition(row: { id: string; target_type: string; key: string; label: string; value_kind: string; active: boolean; created_at: Date; updated_at: Date }): api.ICustomFieldDefinition { return { id: row.id, targetType: row.target_type, key: row.key, label: row.label, valueKind: row.value_kind as api.ICustomFieldDefinition["valueKind"], active: row.active, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
  function value(row: { id: string; definition_id: string; target_type: string; target_id: string; value: string | null; created_at: Date; updated_at: Date }): api.ICustomFieldValue { return { id: row.id, definitionId: row.definition_id, targetType: row.target_type, targetId: row.target_id, value: row.value, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
}
