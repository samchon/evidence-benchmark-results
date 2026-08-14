import type { tags } from "typia";

export interface IPartyChangeRequest {
  id: string & tags.Format<"uuid">;
  partyId: string & tags.Format<"uuid">;
  kind: "bank_account" | "credit_limit";
  proposedValue: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "applied";
  createdAt: string & tags.Format<"date-time">;
  resolvedAt: null | (string & tags.Format<"date-time">);
  appliedAt: null | (string & tags.Format<"date-time">);
}
export namespace IPartyChangeRequest {
  export interface ICreate { kind: IPartyChangeRequest["kind"]; proposedValue: string; reason: string; }
}
