import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:equipment Exposes the persisted equipment record.
 */
export interface IEquipment {
  /** @evidence prisma:equipment.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
  /** @evidence prisma:equipment.code Carries the persisted code value. */
  code: string;
  /** @evidence prisma:equipment.name Carries the persisted name value. */
  name: string;
  /** @evidence prisma:equipment.status Carries the persisted status value. */
  status: string;
/** @evidence prisma:equipment.location_id Carries the persisted locationId value. */
  locationId: null | string;
/** @evidence prisma:equipment.custodian_employee_id Carries the persisted custodianEmployeeId value. */
  custodianEmployeeId: null | string;
/** @evidence prisma:equipment.acquired_at Carries the persisted acquiredAt value. */
  acquiredAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:equipment.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:equipment.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IEquipment { export interface ICreate { code: string; name: string; locationId?: null | string; custodianEmployeeId?: null | string; acquiredAt?: null | (string & tags.Format<"date-time">); } export interface IRequest extends IPage.IRequest { status?: string; } export interface IStatus { status: "active" | "inactive" | "retired"; } }
