import { tags } from "typia";

/**
 * Organization public identity and lifecycle shape.
 * @evidence docs/analysis/02-domain-model.md#req-dom-org-organization-scope Exposes the caller-visible organization contract.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-org-organization-scope Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:organizations Represents the persisted organizations model.
 * @evidenceReview prisma:organizations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IOrganization {
  /** id.
   * @evidence prisma:organizations.id Carries the persisted id value.
   * @evidenceReview prisma:organizations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id: string & tags.Format<"uuid">;
  /** name.
   * @evidence prisma:organizations.name Carries the persisted name value.
   * @evidenceReview prisma:organizations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name: string;
  /** baseCurrency.
   * @evidence prisma:organizations.base_currency Carries the persisted base_currency value.
   * @evidenceReview prisma:organizations.base_currency Read the DTO property and compared its type with the cited Prisma column.
   */
  baseCurrency: string;
  /** timezone.
   * @evidence prisma:organizations.timezone Carries the persisted timezone value.
   * @evidenceReview prisma:organizations.timezone Read the DTO property and compared its type with the cited Prisma column.
   */
  timezone: string;
  /** fiscalStartMonth.
   * @evidence prisma:organizations.fiscal_start_month Carries the persisted fiscal_start_month value.
   * @evidenceReview prisma:organizations.fiscal_start_month Read the DTO property and compared its type with the cited Prisma column.
   */
  fiscalStartMonth: number;
  /** taxJurisdictionId.
   * @evidence prisma:organizations.tax_jurisdiction_id Carries the persisted tax_jurisdiction_id value.
   * @evidenceReview prisma:organizations.tax_jurisdiction_id Read the DTO property and compared its type with the cited Prisma column.
   */
  taxJurisdictionId: null | (string & tags.Format<"uuid">);
  /** defaultPaymentTermId.
   * @evidence prisma:organizations.default_payment_term_id Carries the persisted default_payment_term_id value.
   * @evidenceReview prisma:organizations.default_payment_term_id Read the DTO property and compared its type with the cited Prisma column.
   */
  defaultPaymentTermId: null | (string & tags.Format<"uuid">);
  /** negativeStockPolicy.
   * @evidence prisma:organizations.negative_stock_policy Carries the persisted negative_stock_policy value.
   * @evidenceReview prisma:organizations.negative_stock_policy Read the DTO property and compared its type with the cited Prisma column.
   */
  negativeStockPolicy: string;
  /** approvalThreshold.
   * @evidence prisma:organizations.approval_threshold Carries the persisted approval_threshold value.
   * @evidenceReview prisma:organizations.approval_threshold Read the DTO property and compared its type with the cited Prisma column.
   */
  approvalThreshold: number;
  /** createdAt.
   * @evidence prisma:organizations.created_at Carries the persisted created_at value.
   * @evidenceReview prisma:organizations.created_at Read the DTO property and compared its type with the cited Prisma column.
   */
  createdAt: string & tags.Format<"date-time">;
  /** updatedAt.
   * @evidence prisma:organizations.updated_at Carries the persisted updated_at value.
   * @evidenceReview prisma:organizations.updated_at Read the DTO property and compared its type with the cited Prisma column.
   */
  updatedAt: string & tags.Format<"date-time">;
  /** deletedAt.
   * @evidence prisma:organizations.deleted_at Carries the persisted deleted_at value.
   * @evidenceReview prisma:organizations.deleted_at Read the DTO property and compared its type with the cited Prisma column.
   */
  deletedAt: null | (string & tags.Format<"date-time">);
}
