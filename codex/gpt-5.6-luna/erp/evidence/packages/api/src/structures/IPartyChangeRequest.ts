import type { tags } from "typia";
import type { IPage } from "../typings";

/** Sensitive vendor-bank and customer-credit change requiring approval. */
/**
 * @evidence prisma:party_change_requests Exposes the persisted party_change_requests record.
 */
export interface IPartyChangeRequest {
/** @evidence prisma:party_change_requests.id Carries the persisted id value. */
  id: string & tags.Format<"uuid">;
/** @evidence prisma:party_change_requests.party_type Carries the persisted partyType value. */
  partyType: "vendor" | "customer";
/** @evidence prisma:party_change_requests.party_id Carries the persisted partyId value. */
  partyId: string & tags.Format<"uuid">;
/** @evidence prisma:party_change_requests.change_type Carries the persisted changeType value. */
  changeType: "bank_account" | "credit_limit";
/** @evidence prisma:party_change_requests.requested_value Carries the persisted requestedValue value. */
  requestedValue: string;
/** @evidence prisma:party_change_requests.reason Carries the persisted reason value. */
  reason: string;
/** @evidence prisma:party_change_requests.status Carries the persisted status value. */
  status: "pending" | "approved" | "rejected" | "applied";
/** @evidence prisma:party_change_requests.requested_by_user_id Carries the persisted requestedByUserId value. */
  requestedByUserId: string & tags.Format<"uuid">;
/** @evidence prisma:party_change_requests.decided_by_user_id Carries the persisted decidedByUserId value. */
  decidedByUserId: null | (string & tags.Format<"uuid">);
/** @evidence prisma:party_change_requests.applied_at Carries the persisted appliedAt value. */
  appliedAt: null | (string & tags.Format<"date-time">);
/** @evidence prisma:party_change_requests.created_at Carries the persisted createdAt value. */
  createdAt: string & tags.Format<"date-time">;
/** @evidence prisma:party_change_requests.updated_at Carries the persisted updatedAt value. */
  updatedAt: string & tags.Format<"date-time">;
}
export namespace IPartyChangeRequest {
  export interface ICreate {
    partyType: "vendor" | "customer";
    partyId: string & tags.Format<"uuid">;
    changeType: "bank_account" | "credit_limit";
    requestedValue: string & tags.MinLength<1>;
    reason: string & tags.MinLength<1>;
  }
  export interface IRequest extends IPage.IRequest { partyType?: IPartyChangeRequest["partyType"]; partyId?: string; status?: IPartyChangeRequest["status"]; }
  export interface IStatus { status: "approved" | "rejected"; }
}
