import type { IPage } from "../typings";
import type { tags } from "typia";

/** Seller identity, shop profile, approval, and fulfillment operations. */
export interface IShoppingSeller {
  /** Seller UUID. */
  id: string & tags.Format<"uuid">;
  /** Login email. */
  email: string & tags.Format<"email">;
  /** Pending, approved, or rejected approval state. */
  approvalStatus: string;
  /** Active or banned login state. */
  loginStatus: string;
  /** Whether catalog activity is suspended. */
  suspended: boolean;
  /** Current shop name. */
  shopName: string | null;
  /** Current shop description. */
  shopDescription: string | null;
  /** Current logo reference. */
  logoImage: string | null;
  /** Registration instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Current administrator grades. */
  grades: string[];
}
export namespace IShoppingSeller {
  /** Seller list item. */
  export type ISummary = IShoppingSeller;
  /** Seller registration input. */
  export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Seller login input. */
  export interface ILogin { email: string & tags.Format<"email">; password: string; }
  /** Seller session continuation input. */
  export interface IRefresh { refreshToken: string & tags.MinLength<1>; }
  /** Authorization header accepted by seller-owned operations. */
  export interface IHeaders { Authorization: string & tags.MinLength<1>; }
  /** Issued seller authorization material. */
  export interface IAuthorized { seller: IShoppingSeller; accessToken: string; refreshToken: string; }
  /** Shop profile input. */
  export interface IProfileUpdate { shopName: string & tags.MinLength<1>; shopDescription: string; logoImage: string; }
  /** Password replacement input. */
  export interface IPasswordUpdate { currentPassword: string; newPassword: string & tags.MinLength<8>; }
  /** Access-recovery request input. */
  export interface IRecover { email: string & tags.Format<"email">; }
  /** Access-recovery completion input. */
  export interface IRecoverComplete { challenge: string; newPassword: string & tags.MinLength<8>; }
  /** Closure confirmation input. */
  export interface IClose { currentPassword: string; }
  /** Seller approval submission. */
  export interface IApprovalCreate { reason: string & tags.MinLength<1>; }
  /** Administrator decision input. */
  export interface IDecision { reason?: string | null; }
  /** Pagination input. */
  export type IRequest = IPage.IRequest;
}
