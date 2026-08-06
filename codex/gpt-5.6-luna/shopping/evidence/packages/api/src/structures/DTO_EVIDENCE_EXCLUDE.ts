/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only reviewed non-applicability decisions here, for example:
 * `@evidenceExclude prisma:example_models.internal_note The provider keeps this operator-only value server-side; reject this exclusion if a request or response carries it.`
 */
/**
 * @evidenceExclude prisma:shopping_administrator_requests.decided_by The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.expired_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.revoked_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.shopping_administrator_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrator_sessions.token_hash The credential or session secret remains server-side and is never serialized by a public DTO; reject this exclusion if it appears in a request or response.
 * @evidenceExclude prisma:shopping_administrators.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_administrators.password_hash The credential or session secret remains server-side and is never serialized by a public DTO; reject this exclusion if it appears in a request or response.
 * @evidenceExclude prisma:shopping_cancellation_requests.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.decided_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.decided_by The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.decision_reason The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.reason The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.shopping_order_item_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cancellation_requests.status The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cart_lines.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cart_lines.shopping_cart_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_cart_lines.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_carts.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_carts.shopping_customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_carts.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_categories.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_categories.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_profiles.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_profiles.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_profiles.shopping_customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_profiles.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.expired_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_products.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.decided_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.decided_by The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.decision_reason The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.reason The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.shopping_order_item_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_refund_requests.status The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_reviews.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_approval_requests.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_approval_requests.decided_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_approval_requests.decided_by The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_approval_requests.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_approval_requests.shopping_seller_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_profile_snapshots The seller profile revision record is retained for history but has no public DTO projection; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.id The session identifier is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.revoked_at The session revocation timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.shopping_customer_id The session ownership key is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_customer_sessions.token_hash The session secret remains server-side and is never serialized by a public DTO; reject this exclusion if it appears in a request or response.
 * @evidenceExclude prisma:shopping_customers.deleted_at The retirement timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_inventory_movements.actor_id The audit actor key is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_inventory_movements.shopping_product_variant_id The movement foreign key is provider-only because inventory is projected through a variant; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_orders.shopping_customer_id The order ownership key is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_snapshots.aggregate_json The raw snapshot payload is provider-only; the public DTO exposes the normalized historical fields instead. Reject this exclusion if raw JSON is exposed.
 * @evidenceExclude prisma:shopping_product_snapshots.category_id The snapshot category foreign key is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_snapshots.shopping_product_id The snapshot product foreign key is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_products.deleted_at The retirement timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_order_items.created_at The purchase-item creation timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_images.created_at The image creation timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_images.shopping_product_id The image ownership key is provider-only because images are nested under a product; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_variants.created_at The variant creation timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_variants.deleted_at The variant retirement timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_variants.shopping_product_id The variant ownership key is provider-only because variants are nested under a product; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_product_variants.updated_at The variant update timestamp is provider-only and never serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_profiles.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_profiles.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_profiles.shopping_seller_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_profiles.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.expired_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.revoked_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.shopping_seller_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_seller_sessions.token_hash The credential or session secret remains server-side and is never serialized by a public DTO; reject this exclusion if it appears in a request or response.
 * @evidenceExclude prisma:shopping_sellers.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_sellers.deleted_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipment_items.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipment_items.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipment_items.shopping_shipment_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipments.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipments.shopping_seller_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipping_addresses.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipping_addresses.shopping_customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_shipping_addresses.updated_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_wishlist_entries.shopping_wishlist_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_wishlists.created_at The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_wishlists.id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 * @evidenceExclude prisma:shopping_wishlists.shopping_customer_id The persistence-only field is not serialized by a public DTO; reject this exclusion if a request or response exposes it.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
