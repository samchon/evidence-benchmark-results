import type { IPage } from "../typings";
import type { tags } from "typia";

/** Governance application by an existing customer or seller identity. */
export interface IShoppingAdministratorRequest {
  /** Request UUID. */
  id: string & tags.Format<"uuid">;
  /** Customer or seller identity kind. */
  actorType: "customer" | "seller";
  /** Applicant identity UUID. */
  actorId: string & tags.Format<"uuid">;
  /** Applicant reason. */
  reason: string;
  /** Pending, approved, or rejected. */
  status: string;
  /** Submission instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Decision instant, when decided. */
  decidedAt: string | null;
}
export namespace IShoppingAdministratorRequest {
  /** Application input. */
  export interface ICreate { reason: string & tags.MinLength<1>; }
  /** Application queue input. */
  export type IRequest = IPage.IRequest;
  /** Approval or rejection input. */
  export interface IDecision { approve: boolean; reason?: string | null; }
}
