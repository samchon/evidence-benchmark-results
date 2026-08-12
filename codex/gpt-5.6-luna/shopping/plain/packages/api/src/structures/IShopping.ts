import type { IPage } from "../typings";
import type { tags } from "typia";

/** Authentication and commerce contracts for the shopping platform. */
export interface IShoppingAuthorized {
  /** Authenticated actor identity. */
  actor: { id: string & tags.Format<"uuid">; type: "customer" | "seller" };
  /** Issued authorization material retained by the SDK connection. */
  token: { access: string; refresh: string };
}

/** One-time password recovery challenge. */
export interface IShoppingRecovery {
  /** Indicates that the request was accepted for out-of-band delivery. */
  accepted: true;
  /** Challenge expiration instant. */
  expiresAt: string & tags.Format<"date-time">;
}

/** Customer identity contract. */
export interface IShoppingCustomer {
  /** Customer identifier. */
  id: string & tags.Format<"uuid">;
  /** Login email. */
  email: string & tags.Format<"email">;
  /** Login state. */
  state: "active" | "banned";
  /** Registration instant. */
  createdAt: string & tags.Format<"date-time">;
  /** Current administrator grades. */
  grades: string[];
  /** Live profile, when present. */
  profile: IShoppingCustomerProfile | null;
}
export namespace IShoppingCustomer {
  /** Registration input. */
  export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Login input. */
  export interface ILogin extends IJoin {}
  /** Refresh input. */
  export interface IRefresh { refreshToken: string & tags.MinLength<1>; }
  /** Password change input. */
  export interface IPasswordUpdate { currentPassword: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  /** Recovery request input. */
  export interface IRecoveryRequest { email: string & tags.Format<"email">; }
  /** Recovery completion input. */
  export interface IRecoveryComplete { token: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  /** Account closure input. */
  export interface IDelete { password: string & tags.MinLength<1>; }
  /** Administrative account summary. */
  export type ISummary = IShoppingCustomer;
}

/** Customer profile values. */
export interface IShoppingCustomerProfile {
  /** Customer-facing display name. */ displayName: string;
  /** Contact phone number. */ phoneNumber: string;
}
export namespace IShoppingCustomerProfile {
  /** Profile replacement input. */
  export interface IUpdate { displayName: string & tags.MinLength<1>; phoneNumber: string & tags.MinLength<1>; }
}

/** Seller identity and shop state. */
export interface IShoppingSeller {
  /** Seller identifier. */ id: string & tags.Format<"uuid">;
  /** Login email. */ email: string & tags.Format<"email">;
  /** Approval state. */ approvalState: "pending" | "approved" | "rejected";
  /** Seller suspension flag. */ suspended: boolean;
  /** Login state. */ state: "active" | "banned";
  /** Registration instant. */ createdAt: string & tags.Format<"date-time">;
  /** Current administrator grades. */ grades: string[];
  /** Live shop profile, when present. */ profile: IShoppingSellerProfile | null;
}
export namespace IShoppingSeller {
  /** Registration input. */ export interface IJoin { email: string & tags.Format<"email">; password: string & tags.MinLength<8>; }
  /** Login input. */ export interface ILogin extends IJoin {}
  /** Refresh input. */ export interface IRefresh { refreshToken: string & tags.MinLength<1>; }
  /** Password change input. */ export interface IPasswordUpdate { currentPassword: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  /** Recovery request input. */ export interface IRecoveryRequest { email: string & tags.Format<"email">; }
  /** Recovery completion input. */ export interface IRecoveryComplete { token: string & tags.MinLength<1>; newPassword: string & tags.MinLength<8>; }
  /** Account closure input. */ export interface IDelete { password: string & tags.MinLength<1>; }
  /** Seller status summary. */ export interface IStatus { approvalState: IShoppingSeller["approvalState"]; rejectionReason: string | null; suspended: boolean; banned: boolean; }
  /** Public seller summary. */ export type ISummary = IShoppingSeller;
}

/** Seller shop profile. */
export interface IShoppingSellerProfile {
  /** Shop name. */ shopName: string;
  /** Shop description. */ shopDescription: string;
  /** Logo reference. */ logo: string | null;
}
export namespace IShoppingSellerProfile {
  /** Shop profile replacement input. */ export interface IUpdate { shopName: string & tags.MinLength<1>; shopDescription: string & tags.MinLength<1>; logo?: string | null; }
}

/** Saved shipping destination. */
export interface IShoppingShippingAddress {
  /** Address identifier. */ id: string & tags.Format<"uuid">;
  /** Recipient name. */ recipientName: string;
  /** Recipient phone. */ recipientPhone: string;
  /** Street address. */ streetAddress: string;
  /** City. */ city: string;
  /** State or province. */ stateOrProvince: string;
  /** Postal code. */ postalCode: string;
  /** Country. */ country: string;
  /** Default designation. */ isDefault: boolean;
}
export namespace IShoppingShippingAddress {
  /** Address creation input. */ export interface ICreate { recipientName: string & tags.MinLength<1>; recipientPhone: string & tags.MinLength<1>; streetAddress: string & tags.MinLength<1>; city: string & tags.MinLength<1>; stateOrProvince: string & tags.MinLength<1>; postalCode: string & tags.MinLength<1>; country: string & tags.MinLength<1>; }
  /** Address replacement input. */ export type IUpdate = ICreate;
}

/** Shared product category. */
export interface IShoppingCategory {
  /** Category identifier. */ id: string & tags.Format<"uuid">;
  /** Category name. */ name: string;
  /** Category description. */ description: string;
  /** Direct parent, or null for top-level. */ parent: IShoppingCategory.ISummary | null;
  /** Direct children. */ children: IShoppingCategory.ISummary[];
}
export namespace IShoppingCategory {
  /** Compact category reference. */ export interface ISummary { id: string & tags.Format<"uuid">; name: string; description: string; }
  /** Category creation input. */ export interface ICreate { name: string & tags.MinLength<1>; description: string & tags.MinLength<1>; parentId?: string & tags.Format<"uuid">; }
  /** Category edit input. */ export interface IUpdate { name: string & tags.MinLength<1>; description: string & tags.MinLength<1>; }
}

/** Product image. */
export interface IShoppingProductImage { id: string & tags.Format<"uuid">; url: string & tags.MinLength<1>; order: number & tags.Type<"uint32">; }
/** Product variant. */
export interface IShoppingVariant { id: string & tags.Format<"uuid">; sku: string; options: Record<string, string>; price: number; priceOverride: number | null; stock: number; available: boolean; }
export namespace IShoppingVariant {
  /** Variant creation input. */ export interface ICreate { sku: string & tags.MinLength<1>; options: Record<string, string>; priceOverride?: number | null; }
  /** Variant edit input. */ export type IUpdate = ICreate;
  /** Inventory input. */ export interface IInventory { quantity: number & tags.Type<"uint32"> & tags.Minimum<1>; reason: string & tags.MinLength<1>; }
}

/** Product list card and detail. */
export interface IShoppingProduct {
  /** Product identifier. */ id: string & tags.Format<"uuid">;
  /** Product name. */ name: string;
  /** Product description. */ description: string;
  /** Base price. */ basePrice: number;
  /** Current category. */ category: IShoppingCategory.ISummary | null;
  /** Owning shop presentation. */ seller: IShoppingSellerProfile & { id: string & tags.Format<"uuid"> };
  /** Administrator-only current seller state. */ moderation?: { approvalState: "pending"|"approved"|"rejected"; suspended: boolean; banned: boolean };
  /** Ordered images. */ images: IShoppingProductImage[];
  /** Live variants. */ variants: IShoppingVariant[];
  /** Effective displayed price. */ displayedPrice: number | { min: number; max: number };
  /** Average over live reviews, rounded to one decimal. */ averageRating: number | null;
  /** Number of live reviews. */ reviewCount: number;
  /** Newest-first live reviews. */ reviews: IShoppingReview[];
  /** Whether a customer can select a purchasable variant. */ available: boolean;
  /** Creation instant. */ createdAt: string & tags.Format<"date-time">;
}
export namespace IShoppingProduct {
  /** Product card projection shared by search, category, and wishlist pages. */
  export interface ISummary {
    id: string & tags.Format<"uuid">;
    name: string;
    basePrice: number;
    category: IShoppingCategory.ISummary | null;
    seller: Pick<IShoppingSellerProfile, "shopName" | "logo"> & { id: string & tags.Format<"uuid"> };
    thumbnail: IShoppingProductImage | null;
    displayedPrice: number | { min: number; max: number };
    averageRating: number | null;
    reviewCount: number;
    available: boolean;
    createdAt: string & tags.Format<"date-time">;
    moderation?: IShoppingProduct["moderation"];
  }
  /** Product creation input. */ export interface ICreate { name: string & tags.MinLength<1>; description: string & tags.MinLength<1>; categoryId: string & tags.Format<"uuid">; basePrice: number & tags.Minimum<0>; }
  /** Product edit input. */ export type IUpdate = ICreate;
  /** Search request. */ export interface IRequest extends IPage.IRequest { search?: string | null; categoryId?: string | null; minPrice?: number | null; maxPrice?: number | null; inStock?: boolean | null; sort?: "createdAt" | "priceAsc" | "priceDesc" | null; }
  /** Image upload input. */ export interface IImages { urls: (string & tags.MinLength<1>)[] & tags.MinItems<1>; }
  /** Image reorder input. */ export interface IImageOrder { imageIds: string[] & tags.MinItems<0>; }
  /** Snapshot of a product edit. */ export interface ISnapshot { id: string & tags.Format<"uuid">; changed: string[]; before: ISnapshot.IState; after: ISnapshot.IState; createdAt: string & tags.Format<"date-time">; }
  export namespace ISnapshot {
    /** One ordered image captured in product evidence. */ export interface IImage { id: string & tags.Format<"uuid">; url: string & tags.MinLength<1>; order: number & tags.Type<"uint32">; }
    /** One variant captured in product evidence. */ export interface IVariant { id: string & tags.Format<"uuid">; sku: string; options: Record<string, string>; priceOverride: number | null; }
    /** Complete product aggregate captured at one point in time. */ export interface IState { name: string; description: string; categoryId: (string & tags.Format<"uuid">) | null; basePrice: number; images: IImage[]; variants: IVariant[]; }
  }
}

/** Immutable evidence for a non-product editable or decision record. */
export interface IShoppingSnapshot {
  /** Snapshot identifier. */
  id: string & tags.Format<"uuid">;
  /** Snapshot operation kind. */
  kind: string;
  /** Record family whose state changed. */
  subjectType: string;
  /** Identifier of the changed record. */
  subjectId: string & tags.Format<"uuid">;
  /** Fields or collection members that changed. */
  changed: string[];
  /** Complete state before the change. */
  before: Record<string, unknown>;
  /** Complete state after the change. */
  after: Record<string, unknown>;
  /** Change instant. */
  createdAt: string & tags.Format<"date-time">;
}

/** Wishlist entry. */
export interface IShoppingWishlistEntry { id: string & tags.Format<"uuid">; product: IShoppingProduct.ISummary; savedAt: string & tags.Format<"date-time">; }
/** Cart line. */
export interface IShoppingCartLine { id: string & tags.Format<"uuid">; variant: IShoppingVariant & { product: IShoppingProduct.ISummary }; quantity: number; subtotal: number; available: boolean; shortage: boolean; }
/** Cart response. */
export interface IShoppingCart { lines: IShoppingCartLine[]; total: number; }

/** Order item. */
export interface IShoppingOrderItem { id: string & tags.Format<"uuid">; productName: string; productDescription: string; variantSku: string; variantOptions: Record<string,string>; seller: { id: string & tags.Format<"uuid">; shopName: string; logo: string | null }; unitPrice: number; quantity: number; status: "paid"|"shipped"|"delivered"|"cancelled"|"refunded"; deliveredAt: string & tags.Format<"date-time"> | null; shipmentId: string & tags.Format<"uuid"> | null; orderId?: string & tags.Format<"uuid">; purchasedAt?: string & tags.Format<"date-time">; customerId?: string & tags.Format<"uuid"> | null; address?: Omit<IShoppingShippingAddress, "id"|"isDefault">; cancellationRequests?: IShoppingRequest[]; refundRequests?: IShoppingRequest[]; restorations?: { id: string & tags.Format<"uuid">; quantityChange: number; reason: string; createdAt: string & tags.Format<"date-time"> }[]; }
/** Order detail. */
export interface IShoppingOrder { id: string & tags.Format<"uuid">; orderNumber: string; purchasedAt: string & tags.Format<"date-time">; totalPrice: number; status: "paid"|"shipped"|"delivered"|"cancelled"|"refunded"|"partially completed"; address: Omit<IShoppingShippingAddress, "id"|"isDefault">; items: IShoppingOrderItem[]; shipments: IShoppingShipment[]; forcedActions?: { id: string & tags.Format<"uuid">; kind: string; actorId: string & tags.Format<"uuid">; reason: string; beforeStatus: IShoppingOrderItem["status"]; afterStatus: IShoppingOrderItem["status"]; createdAt: string & tags.Format<"date-time"> }[]; }
export namespace IShoppingOrder {
  /** Order card. */ export type ISummary = Pick<IShoppingOrder, "id"|"orderNumber"|"purchasedAt"|"totalPrice"|"status">;
  /** Platform order-directory row. */ export interface IAdminSummary extends ISummary { customerId: string & tags.Format<"uuid"> | null; itemCount: number; sellerCount: number; }
  /** Platform order-directory filters. */ export interface IAdminRequest extends IPage.IRequest { status?: "paid"|"shipped"|"delivered"|"cancelled"|"refunded"|"partially completed"|null; customerId?: string & tags.Format<"uuid"> | null; sellerId?: string & tags.Format<"uuid"> | null; createdFrom?: string & tags.Format<"date-time"> | null; createdTo?: string & tags.Format<"date-time"> | null; }
  /** Checkout start input. */ export interface ICheckout { addressId?: string & tags.Format<"uuid">; }
  /** Checkout summary. */ export interface ICheckoutSummary { attemptId: string; address: IShoppingOrder["address"]; items: IShoppingOrderItem[]; totalPrice: number; }
  /** Payment confirmation input, including an unresolved gateway result. */ export interface IPayment { attemptId: string; success: boolean | "unknown"; amount: number; }
  /** Administrative force action input. */ export interface IForce { reason: string & tags.MinLength<1>; }
}
/** Shipment package. */
export interface IShoppingShipment { id: string & tags.Format<"uuid">; seller: { id: string & tags.Format<"uuid">; shopName: string; }; carrier: string; trackingNumber: string; shippedAt: string & tags.Format<"date-time">; deliveredAt: string & tags.Format<"date-time"> | null; itemIds: (string & tags.Format<"uuid">)[]; }
export namespace IShoppingShipment { /** Shipment input. */ export interface ICreate { itemIds: string[] & tags.MinItems<1>; carrier: string & tags.MinLength<1>; trackingNumber: string & tags.MinLength<1>; } }

/** Request reason and status. */
export interface IShoppingRequest { id: string & tags.Format<"uuid">; reason: string; status: "pending"|"approved"|"rejected"; orderItemId: string & tags.Format<"uuid">; createdAt: string & tags.Format<"date-time">; decidedAt: string & tags.Format<"date-time"> | null; orderId?: string & tags.Format<"uuid">; customerId?: string & tags.Format<"uuid"> | null; productName?: string; variantSku?: string; quantity?: number; deliveredAt?: string & tags.Format<"date-time"> | null; address?: Omit<IShoppingShippingAddress, "id"|"isDefault">; }
export namespace IShoppingRequest { export interface ICreate { reason: string & tags.MinLength<1>; } }
/** Product review. */
export interface IShoppingReview { id: string & tags.Format<"uuid">; rating: 1|2|3|4|5; text: string | null; author: { id: string & tags.Format<"uuid"> | null; displayName: string }; publishedAt: string & tags.Format<"date-time">; }
export namespace IShoppingReview { export interface ICreate { rating: 1|2|3|4|5; text?: string | null; } export type IUpdate = ICreate; }
/** Seller dashboard. */
export interface IShoppingDashboard { products: number; orderItems: number; pendingCancellations: number; pendingRefunds: number; }
/** Administrator action request. */
export interface IShoppingAdministratorApplication { id: string & tags.Format<"uuid">; actorType: "customer"|"seller"; actorId: string & tags.Format<"uuid">; reason: string; status: "pending"|"approved"|"rejected"; createdAt: string & tags.Format<"date-time">; decidedAt: string & tags.Format<"date-time"> | null; }
export namespace IShoppingAdministratorApplication { export interface ICreate { reason: string & tags.MinLength<1>; } }
/** Generic moderation target input. */
export interface IShoppingModeration { reason: string & tags.MinLength<1>; }
/** Successful command marker. */
export interface IShoppingSuccess { success: true; }
