import type { tags } from "typia"; import type { IPage } from "../typings";
/**
 * @evidence prisma:routing_steps Exposes the persisted routing_steps record.
 */
export interface IRoutingStep {
  /** @evidence prisma:routing_steps.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:routing_steps.routing_id Carries the persisted routingId value. */
  routingId: string & tags.Format<"uuid">;
/** @evidence prisma:routing_steps.sequence Carries the persisted sequence value. */
  sequence: number;
/** @evidence prisma:routing_steps.work_center_id Carries the persisted workCenterId value. */
  workCenterId: null | string;
/** @evidence prisma:routing_steps.description Carries the persisted description value. */
  description: string;
/** @evidence prisma:routing_steps.setup_minutes Carries the persisted setupMinutes value. */
  setupMinutes: number;
/** @evidence prisma:routing_steps.run_minutes Carries the persisted runMinutes value. */
  runMinutes: number;
/** @evidence prisma:routing_steps.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:routing_steps.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IRoutingStep { export interface ICreate { routingId: string & tags.Format<"uuid">; sequence: number; workCenterId?: null | string; description: string; setupMinutes: number; runMinutes: number; } export interface IRequest extends IPage.IRequest { routingId?: string; workCenterId?: string; } }
