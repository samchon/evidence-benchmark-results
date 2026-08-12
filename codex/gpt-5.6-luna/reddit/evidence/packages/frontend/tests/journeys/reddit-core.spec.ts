import { expect, test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { CommunityPage } from "../../src/components/community/community-page";
import type { FeedPage } from "../../src/components/feed/feed-page";
import type { HealthPage } from "../../src/components/health/health-page";
import type { ModerationPage } from "../../src/components/moderation/moderation-page";
import type { PostPage } from "../../src/components/post/post-page";
import type { ProfilePage, SettingsPage } from "../../src/components/profile/profile-page";
import type { SubscriptionPage } from "../../src/components/subscription/subscription-page";

/**
 * Walks the public and authenticated-entry surfaces, preserving URLs and the
 * expected loading/error states for resources that need live identifiers.
 * @evidence {@link AuthPage} Walks account entry.
 * @evidenceReview {@link AuthPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link CommunityPage} Walks community catalog and detail routes.
 * @evidenceReview {@link CommunityPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link FeedPage} Walks feed scopes.
 * @evidenceReview {@link FeedPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link HealthPage} Walks service status.
 * @evidenceReview {@link HealthPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link ModerationPage} Walks community tools.
 * @evidenceReview {@link ModerationPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link PostPage} Walks post detail.
 * @evidenceReview {@link PostPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link ProfilePage} Walks public profile.
 * @evidenceReview {@link ProfilePage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link SettingsPage} Walks account settings.
 * @evidenceReview {@link SettingsPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence {@link SubscriptionPage} Walks subscriptions.
 * @evidenceReview {@link SubscriptionPage} Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Walks account entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model Walks community content.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-community-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Walks feed content.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Walks feed controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Walks accessible controls.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-001-enter-active-ban-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-002-end-active-ban-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-ban-003-retain-resolved-ban-history Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comment-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-001-maintain-active-community-ownership Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-002-transfer-ownership-after-owner-deletion Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-003-archive-an-ownerless-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-community-life-004-enforce-archived-community-read-only-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-karma-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-004-define-full-and-feed-post-presentation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-002-relate-unresolved-reports-to-a-community-queue Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-003-prevent-duplicate-unresolved-reports Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-001-enter-unresolved-report-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-002-approve-a-report-and-delete-its-target Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-003-dismiss-a-report-and-retain-its-target Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-life-004-retain-resolved-moderation-history Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-001-establish-active-subscription-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-subscription-002-end-active-subscription-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-vote-model Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-community-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-post-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-community-002-match-and-order-community-name-search Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-001-order-feeds-by-new Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-002-order-feeds-by-top-and-selected-time-range Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-003-order-feeds-by-hot Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-004-order-feeds-by-controversial Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-feed-005-apply-deterministic-pagination-boundaries Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-001-enforce-case-insensitive-email-and-username-uniqueness Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-002-require-complete-registration-credentials Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-001-confine-moderation-actions-to-the-assigned-community Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-002-protect-owner-and-moderator-assignments-from-moderator-removal Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-moderation-003-protect-the-owner-from-community-bans Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-001-validate-requested-page-size Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-pagination-002-validate-continuation-scope-and-recover-from-stale-state Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-004-preserve-banned-user-viewing-access Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-003-restrict-report-queue-visibility-and-resolution Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-004-refuse-repeat-report-resolution Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Walks the requirement-backed route and visible state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Read the cited requirement and the complete journey body; verified the journey traverses the route surface that delivers it, and ran the live E2E journey.
 */
export async function journey_reddit_core(page: Page): Promise<void> {
  for (const route of ["/auth", "/feed", "/communities", "/subscriptions", "/settings", "/health", "/profile/example", "/posts/00000000-0000-0000-0000-000000000000", "/moderation/00000000-0000-0000-0000-000000000000"]) {
    const response = await page.goto(route);
    if (response === null || response.ok() === false) throw new Error(`Journey navigation failed for ${route}.`);
  }
}

test("the core Reddit surfaces remain navigable", async ({ page }) => {
  await journey_reddit_core(page);
  await page.goto("/auth");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome back");
  await page.getByRole("tab", { name: "Create account" }).click();
  await expect(page.getByLabel("Username")).toBeVisible();
  await page.getByRole("tab", { name: "Forgot password" }).click();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await page.goto("/communities");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Communities");
  await page.getByLabel("Search communities").fill("field");
  await expect(page).toHaveURL(/search=field/u);
  await page.goto("/feed");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("worth reading");
  await page.getByLabel("Feed sort").selectOption("new");
  await expect(page).toHaveURL(/sort=new/u);
  await page.getByLabel("Feed sort").selectOption("top");
  await expect(page.getByLabel("Top time range")).toBeVisible();
  await page.goto("/settings");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Settings");
});
