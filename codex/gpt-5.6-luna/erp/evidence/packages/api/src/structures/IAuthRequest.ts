import { tags } from "typia";

/**
 * Authentication and organization-authority command input.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Carries the credentials, invitation, session, membership, and role selectors used by authentication commands.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the DTO declaration and checked its public and inherited fields against the cited requirement.
 */
export interface IAuthRequest {
  /** Optional target identity. */
  id?: null | (string & tags.Format<"uuid">);
  /** Optional organization selector. */
  organizationId?: null | (string & tags.Format<"uuid">);
  /** Optional user selector. */
  userId?: null | (string & tags.Format<"uuid">);
  /** Optional membership selector. */
  membershipId?: null | (string & tags.Format<"uuid">);
  /** Optional role selector. */
  roleId?: null | (string & tags.Format<"uuid">);
  /** Optional session selector. */
  sessionId?: null | (string & tags.Format<"uuid">);
  /** Optional invitation selector. */
  invitationId?: null | (string & tags.Format<"uuid">);
  /** Account email used by provisioning, login, and recovery. */
  email?: null | (string & tags.Format<"email">);
  /** Credential supplied only to authentication commands. */
  password?: null | string;
  /** Existing credential required by an authenticated password change. */
  currentPassword?: null | string;
  /** Invitation or recovery token; it is never returned by the API. */
  token?: null | string;
  /** User-facing display name. */
  displayName?: null | string;
  /** Organization or role name. */
  name?: null | string;
  /** Requested role kind. */
  roleKind?: null | string;
  /** Serialized permission set for a custom role. */
  permissions?: null | string;
  /** Requested lifecycle status. */
  status?: null | string;
}
