import type { IPage } from "../typings";
import type { tags } from "typia";

/** Customer identity, profile, and private shopping operations. */
export interface IShoppingCustomer {
  /** Customer UUID. */
  id: string & tags.Format<"uuid">;
  /** Login email. */
  email: string & tags.Format<"email">;
  /** Active or banned login state. */
  loginStatus: string;
  /** Customer-facing display name while active. */
  displayName: string | null;
  /** Contact phone while active. */
  phoneNumber: string | null;
  /** Registration instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Current administrator grades. */
  grades: string[];
}
export namespace IShoppingCustomer {
  /** Customer list item. */
  export type ISummary = IShoppingCustomer;
  /** Registration input. */
  export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Login input. */
  export interface ILogin { email: string & tags.Format<"email">; password: string; }
  /** Refresh input. */
  export interface IRefresh { refreshToken: string & tags.MinLength<1>; }
  /** Authorization header accepted by customer-owned operations. */
  export interface IHeaders { Authorization: string & tags.MinLength<1>; }
  /** Issued customer authorization material. */
  export interface IAuthorized { customer: IShoppingCustomer; accessToken: string; refreshToken: string; }
  /** Profile replacement input. */
  export interface IProfileUpdate { displayName: string & tags.MinLength<1>; phoneNumber: string & tags.MinLength<1>; }
  /** Password replacement input. */
  export interface IPasswordUpdate { currentPassword: string; newPassword: string & tags.MinLength<8>; }
  /** Closure confirmation input. */
  export interface IClose { currentPassword: string; }
  /** Access-recovery request input. */
  export interface IRecover { email: string & tags.Format<"email">; }
  /** Access-recovery completion input. */
  export interface IRecoverComplete { challenge: string; newPassword: string & tags.MinLength<8>; }
  /** Wishlist entry. */
  export interface IWishlist { id: string & tags.Format<"uuid">; productId: string & tags.Format<"uuid">; createdAt: string & tags.Format<"date-time">; }
  /** Saved-address input. */
  export interface IAddressCreate { recipientName: string; recipientPhone: string; streetAddress: string; city: string; stateOrProvince: string; postalCode: string; country: string; isDefault?: boolean; }
  /** Saved-address update input. */
  export type IAddressUpdate = IAddressCreate;
  /** Saved address response. */
  export interface IAddress extends IAddressCreate { id: string & tags.Format<"uuid">; createdAt: string & tags.Format<"date-time">; }
  /** Wishlist and order pagination. */
  export type IRequest = IPage.IRequest;
  /** Address default operation response. */
  export interface IResult { success: true; }
}
