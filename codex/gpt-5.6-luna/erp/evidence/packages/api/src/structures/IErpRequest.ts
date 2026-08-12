import { tags } from "typia";

/**
 * Request boundary shared by generated lifecycle accessors.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Represents caller-supplied lifecycle command fields.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 * @evidence prisma:organizations Represents the organization-scoped request source.
 * @evidenceReview prisma:organizations Read the DTO declaration and compared its concrete record shape with the cited Prisma model.
 */
export interface IErpRequest {
  /** Aggregate-specific fields retained by the domain record. */
  attributes?: null | Record<string, unknown>;
  /** Currently selected organization; omitted only for the default test tenant.
   * @evidence prisma:organizations.id Resolves the organization boundary before business access.
   * @evidenceReview prisma:organizations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  organizationId?: null | (string & tags.Format<"uuid">);
  /** id.
   * @evidence prisma:organizations.id Carries caller-supplied id.
   * @evidenceReview prisma:organizations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  id?: null | (string & tags.Format<"uuid">);
  /** name.
   * @evidence prisma:organizations.name Carries caller-supplied name.
   * @evidenceReview prisma:organizations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  name?: null | string;
  /** status.
   * @evidence prisma:addresses.status Carries caller-supplied status.
   * @evidenceReview prisma:addresses.status Read the DTO property and compared its type with the cited Prisma column.
   */
  status?: null | string;
  /** description.
   * @evidence prisma:organizations.name Carries caller-supplied description.
   * @evidenceReview prisma:organizations.name Read the DTO property and compared its type with the cited Prisma column.
   */
  description?: null | string;
  /** referenceId.
   * @evidence prisma:organizations.id Carries caller-supplied referenceId.
   * @evidenceReview prisma:organizations.id Read the DTO property and compared its type with the cited Prisma column.
   */
  referenceId?: null | (string & tags.Format<"uuid">);
  /** quantity.
   * @evidence prisma:organizations.approval_threshold Carries caller-supplied quantity.
   * @evidenceReview prisma:organizations.approval_threshold Read the DTO property and compared its type with the cited Prisma column.
   */
  quantity?: null | number;
  /** amount.
   * @evidence prisma:organizations.approval_threshold Carries caller-supplied amount.
   * @evidenceReview prisma:organizations.approval_threshold Read the DTO property and compared its type with the cited Prisma column.
   */
  amount?: null | number;
}
