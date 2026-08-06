import type { tags } from "typia";

/**
 * The authenticated account's private profile.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Represents the private display identity.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Represents the profile surface.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Represents the display-name contract.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-private-data-isolation Represents private profile output.
 * @evidence prisma:todo_profiles Represents the persisted profile model.
 */
export interface IProfile {
  /**
   * Stable profile identifier.
   * @evidence prisma:todo_profiles.id Carries profile identity.
   */
  id: string & tags.Format<"uuid">;
  /**
   * Current trimmed display name.
   * @evidence prisma:todo_profiles.display_name Carries profile content.
   */
  displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
  /**
   * Creation instant.
   * @evidence prisma:todo_profiles.created_at Carries profile history.
   */
  createdAt: string & tags.Format<"date-time">;
  /**
   * Last update instant.
   * @evidence prisma:todo_profiles.updated_at Carries profile freshness.
   */
  updatedAt: string & tags.Format<"date-time">;
}
