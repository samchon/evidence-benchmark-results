import type { tags } from "typia";

/**
 * Display-name replacement body.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Represents profile update validation.
 * @evidence prisma:todo_profiles Represents profile updates.
 */
export interface IProfileUpdate {
  /**
   * Trimmed display name.
   * @evidence prisma:todo_profiles.display_name Carries profile content.
   */
  displayName: string & tags.MinLength<1> & tags.MaxLength<100>;
}
