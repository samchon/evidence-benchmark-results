/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only settled non-applicability decisions here, for example:
 * `@evidenceExclude prisma:example_models.internal_note The provider keeps this operator-only value server-side; reject this exclusion if a request or response carries it.`
 *
 * @evidenceExclude prisma:shopping_customers.password_hash The authentication
 * provider keeps password hashes server-side; reject this exclusion if a DTO
 * publishes credential material.
 * @evidenceExcludeReview prisma:shopping_customers.password_hash Read every
 * customer DTO and the authentication provider; confirmed no response carries
 * the stored password hash.
 * @evidenceExclude prisma:shopping_customer_sessions.refresh_token_hash The
 * session provider keeps token digests server-side; reject this exclusion if a
 * DTO publishes the digest.
 * @evidenceExcludeReview prisma:shopping_customer_sessions.refresh_token_hash
 * Read the session DTOs and refresh flow; confirmed only issued tokens cross
 * the boundary, never the stored digest.
 * @evidenceExclude prisma:shopping_sellers.password_hash The authentication
 * provider keeps password hashes server-side; reject this exclusion if a DTO
 * publishes credential material.
 * @evidenceExcludeReview prisma:shopping_sellers.password_hash Read every
 * seller DTO and the authentication provider; confirmed no response carries
 * the stored password hash.
 * @evidenceExclude prisma:shopping_seller_sessions.refresh_token_hash The
 * session provider keeps token digests server-side; reject this exclusion if a
 * DTO publishes the digest.
 * @evidenceExcludeReview prisma:shopping_seller_sessions.refresh_token_hash
 * Read the seller session DTOs and refresh flow; confirmed only issued tokens
 * cross the boundary, never the stored digest.
 * @evidenceExclude prisma:shopping_delivery_challenges.payload Credential and
 * recovery payloads are consumed only by the delivery boundary; reject this
 * exclusion if an API response publishes a secret.
 * @evidenceExcludeReview prisma:shopping_delivery_challenges.payload Read the
 * recovery request/complete DTOs and delivery provider; confirmed the payload
 * stays inside the delivery boundary.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
