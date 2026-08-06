import type { IEntity, IPage } from "../typings";
import type { tags } from "typia";

type UUID = string & tags.Format<"uuid">;
type DateTime = string & tags.Format<"date-time">;

/** UUID identifier used by path parameters. */
export type ShoppingUUID = UUID;

/** Authentication header envelope accepted by protected operations. */
export interface IShoppingHeaders {
  authorization?: string;
}

/** Authentication and actor contracts. */
export namespace IShoppingAuth {
  export type Actor = "customer" | "seller";
  export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  export interface ILogin extends IJoin {}
  export interface IRefresh { refreshToken: string & tags.MinLength<1>; }
  export interface IPasswordChange { currentPassword: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  export interface IAccountDelete { password: string & tags.MinLength<1>; }
  export interface IRecoveryRequest { email: string & tags.Format<"email">; }
  export interface IRecoveryComplete { token: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  export interface IRecoveryChallenge { token: string; expiresAt: DateTime; }
  export interface IAuthorized { id: UUID; type: Actor; token: string; refreshToken: string; }
}

/** Customer profile contract. */
export namespace IShoppingCustomerProfile {
  export interface IUpdate { displayName: string & tags.MinLength<1> & tags.MaxLength<255>; phone: string & tags.MinLength<1> & tags.MaxLength<64>; }
  export interface IDetail { id: UUID; displayName: string; phone: string; }
}

/** Seller profile and approval contracts. */
export namespace IShoppingSellerProfile {
  export interface IUpdate { shopName: string & tags.MinLength<1> & tags.MaxLength<255>; shopDescription: string & tags.MinLength<1>; shopLogo?: null | string; }
  export interface IDetail { id: UUID; shopName: string; shopDescription: string; shopLogo: null | string; approvalStatus: string; suspended: boolean; banned: boolean; }
  export interface ISnapshot { id: UUID; sellerId: UUID; changedFields: string; before: string; after: string; createdAt: DateTime; }
}

/** Shipping address contract. */
export namespace IShoppingAddress {
  export interface ICreate { recipientName: string; phone: string; streetAddress: string; city: string; state: string; postalCode: string; country: string; }
  export interface IUpdate extends ICreate {}
  export interface IDetail extends ICreate { id: UUID; isDefault: boolean; }
}

/** Category contract. */
export namespace IShoppingCategory {
  export interface ICreate { name: string & tags.MinLength<1>; description: string; parentId?: null | UUID; }
  export interface IUpdate { name: string & tags.MinLength<1>; description: string; }
  export interface ISummary { id: UUID; name: string; description: string; parentId: null | UUID; children: ISummary[]; }
  export interface IDetail extends ISummary {}
}

/** Product and variant contracts. */
export namespace IShoppingProduct {
  export interface ICreate { name: string & tags.MinLength<1>; description: string; categoryId: UUID; basePrice: number & tags.Minimum<0>; }
  export interface IUpdate extends ICreate {}
  export interface IImage { id: UUID; uri: string; sequence: number; }
  export interface IImageCreate { uri: string & tags.MinLength<1>; }
  export interface IImageReorder { imageIds: UUID[]; }
  export interface IVariantCreate { sku: string & tags.MinLength<1>; options: Record<string, string>; priceOverride?: null | (number & tags.Minimum<0>); }
  export interface IVariantUpdate extends IVariantCreate {}
  export interface IVariant { id: UUID; sku: string; options: Record<string, string>; priceOverride: null | number; stock: number; }
  export interface ISummary { id: UUID; sellerId: UUID; sellerName: string; name: string; description: string; basePrice: number; priceMin: number; priceMax: number; thumbnail: null | string; available: boolean; averageRating: null | number; reviewCount: number; createdAt: DateTime; }
  export interface IDetail extends ISummary { categoryId: null | UUID; images: IImage[]; variants: IVariant[]; reviews: IShoppingReview.IDetail[]; }
  export interface ISnapshot { id: UUID; productId: UUID; changedFields: string; createdAt: DateTime; before: string; after: string; payload: string; }
  export interface IRequest extends IPage.IRequest { search?: null | string; categoryId?: null | UUID; sellerId?: null | UUID; minPrice?: null | number; maxPrice?: null | number; inStock?: null | boolean; sort?: null | "newest" | "priceAsc" | "priceDesc"; }
}

/** Inventory and cart contracts. */
export namespace IShoppingInventory {
  /** Seller-entered stock movement. Quantity is always a positive magnitude;
   * `operation` selects whether it is added or subtracted from the ledger. */
  export interface ICreate {
    quantity: number & tags.Type<"uint32"> & tags.Minimum<1>;
    reason: string & tags.MinLength<1>;
    operation?: "restock" | "adjustment" | "loss";
  }
  export interface IMovement { id: UUID; quantity: number; reason: string; createdAt: DateTime; }
  /** Paginated movement history together with the ledger's calculated current stock. */
  export interface IHistory extends IPage<IMovement> { currentStock: number; }
}
export namespace IShoppingCart {
  export interface ICreate { variantId: UUID; quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  export interface IUpdate { quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; }
  export interface ILine { id: UUID; variantId: UUID; productId: UUID; productName: string; sku: string; options: Record<string, string>; unitPrice: number; quantity: number; subtotal: number; available: boolean; shortage: boolean; }
  export interface ISummary { lines: ILine[]; total: number; }
}
export namespace IShoppingWishlist {
  export interface ISummary { id: UUID; productId: UUID; product: IShoppingProduct.ISummary; createdAt: DateTime; }
}

/** Order, shipment, request, and review contracts. */
export namespace IShoppingOrder {
  export type ItemStatus = "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  export interface IItem { id: UUID; productId: UUID; productName: string; variantSku: string; options: Record<string, string>; sellerId: UUID; sellerName: string; unitPrice: number; quantity: number; status: ItemStatus; purchasedAt: DateTime; deliveredAt?: null | DateTime; refundAmount?: null | number; orderId?: UUID; orderNumber?: string; recipientName?: string; phone?: string; streetAddress?: string; city?: string; state?: string; postalCode?: string; country?: string; productDescription?: string; }
  export interface IShipment { id: UUID; sellerId: UUID; carrier: string; trackingNumber: string; shippedAt: DateTime; deliveredAt: null | DateTime; itemIds: UUID[]; }
  export interface ISummary { id: UUID; orderNumber: string; total: number; status: string; createdAt: DateTime; itemCount: number; }
  export interface IDetail extends ISummary { recipientName: string; phone: string; streetAddress: string; city: string; state: string; postalCode: string; country: string; items: IItem[]; shipments: IShipment[]; requests?: IShoppingRequest.IDetail[]; adminActions?: IShoppingAdmin.IAction[]; }
  export interface IAdminRequest extends IPage.IRequest { status?: null | string; customerId?: null | UUID; sellerId?: null | UUID; createdFrom?: null | DateTime; createdTo?: null | DateTime; }
  export interface ISellerRequest extends IPage.IRequest { status?: null | ItemStatus; }
}
export namespace IShoppingCheckout {
  export interface IStart { addressId?: null | UUID; }
  export interface ILine { variantId: UUID; productId: UUID; productName: string; variantSku: string; unitPrice: number; quantity: number; subtotal: number; }
  export interface ISummary { id: UUID; status: string; total: number; recipientName: string; phone: string; streetAddress: string; city: string; state: string; postalCode: string; country: string; lines: ILine[]; }
  /** Gateway result submitted for one idempotent payment attempt.
   *
   * `status` is the authoritative result.  `succeeded` remains accepted for
   * compatibility with the original boolean gateway stub; when omitted the
   * provider treats the result as `unknown` until reconciliation resolves it.
   */
  export interface IPayment {
    paymentAttemptId: string & tags.MinLength<1>;
    status?: "failed" | "succeeded" | "unknown";
    succeeded?: boolean;
    amount: number & tags.Minimum<0>;
  }
  export interface IPaymentResult { status: "failed" | "succeeded" | "unknown"; checkout: ISummary; order?: IShoppingOrder.IDetail; }
}
export namespace IShoppingShipment {
  export interface ICreate { itemIds: UUID[]; carrier: string & tags.MinLength<1>; trackingNumber: string & tags.MinLength<1>; }
}
export namespace IShoppingRequest {
  export interface ICreate { reason: string & tags.MinLength<1>; }
  export interface ISnapshot { id: UUID; beforeStatus: string; afterStatus: string; beforeReason: string; afterReason: string; actorId: UUID; actorKind: string; createdAt: DateTime; }
  export interface IDetail { id: UUID; itemId: UUID; kind: "cancellation" | "refund"; reason: string; status: string; createdAt: DateTime; decidedAt: null | DateTime; snapshots?: ISnapshot[]; orderId?: UUID; orderNumber?: string; quantity?: number; deliveredAt?: null | DateTime; productName?: string; variantSku?: string; sellerId?: UUID; }
}
export namespace IShoppingReview {
  export interface ICreate { productId: UUID; orderId: UUID; rating: number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<5>; text?: null | string; }
  export interface IUpdate { rating: number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<5>; text?: null | string; }
  export interface IDetail { id: UUID; productId: UUID; authorId: null | UUID; authorName: string; rating: number; text: null | string; createdAt: DateTime; }
}

/** Seller approval and administrator contracts. */
export namespace IShoppingSellerApproval {
  export interface IDetail { id: UUID; sellerId: UUID; seller: IShoppingSellerProfile.IDetail; status: string; reason: null | string; createdAt: DateTime; decidedAt: null | DateTime; decidedById: null | UUID; }
  export interface IDecision { reason?: null | string; }
}
export namespace IShoppingAdminApplication {
  export interface ICreate { reason: string & tags.MinLength<1>; }
  export interface IDetail { id: UUID; applicantId: UUID; applicantKind: IShoppingAuth.Actor; reason: string; status: string; createdAt: DateTime; decidedAt: null | DateTime; decidedById: null | UUID; }
}
export namespace IShoppingAdmin {
  export interface IUserSummary { id: UUID; email: string; displayName: null | string; kind: string; banned: boolean; grades: string[]; createdAt: DateTime; }
  export interface IReason { reason: string & tags.MinLength<1>; }
  export interface ISummary { products: number; orderItems: number; pendingCancellations: number; pendingRefunds: number; }
  export interface IOrderSummary extends IShoppingOrder.ISummary { customerId: null | UUID; sellerCount: number; }
  export interface IAction { id: UUID; actorId: UUID; targetKind: string; targetId: UUID; action: string; reason: string; outcome: string; createdAt: DateTime; }
  export interface IActionRequest extends IPage.IRequest { targetKind?: null | string; targetId?: null | UUID; action?: null | string; }
}

/** A reusable empty entity reference. */
export type IShoppingEntity = IEntity;
