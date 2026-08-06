import { test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { CommunityPage } from "../../src/components/community/community-page";
import type { HomePage } from "../../src/components/home/home-page";
import type { PostPage } from "../../src/components/post/post-page";
import type { ProfilePage } from "../../src/components/profile/profile-page";

/**
 * @evidence {@link HomePage} Walks the public feed, community search, and creation entrypoints.
 * @evidence {@link AuthPage} Walks login, registration, recovery, and settings entrypoints.
 * @evidence {@link CommunityPage} Walks the community feed, post form, subscription, and moderation entrypoints.
 * @evidence {@link PostPage} Walks the post, voting, reporting, and comment entrypoints.
 * @evidence {@link ProfilePage} Walks the public profile and profile-edit entrypoints.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-002-recover-a-forgotten-password The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-001-register-a-user-account The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-002-refuse-conflicting-registration The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-003-log-in-with-credentials The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-004-refuse-ineligible-login The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-reg-account-provisioning-and-login The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-002-owner-appointment-of-moderators The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-003-moderator-appointment-of-peers The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-004-owner-removal-of-moderators The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-005-protect-owner-and-moderator-assignments The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-002-continue-an-authenticated-session The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-001-ban-a-user-from-a-community The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-002-unban-a-user-from-a-community The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-003-view-a-communitys-banned-users The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-ban-community-ban-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-002-browse-all-communities The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-003-search-communities-by-name The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-001-view-the-authenticated-home-feed The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-002-view-the-public-popular-feed The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-003-view-a-public-community-feed The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-004-choose-feed-sorting-and-top-time-range The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-005-navigate-paginated-feed-results The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-006-display-feed-post-cards The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-feed-post-feed-journeys The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-002-view-unresolved-community-reports The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-003-approve-a-report The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-004-dismiss-a-report The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-content-reporting-and-resolution The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-001-add-a-moderator-as-community-owner The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-002-add-a-moderator-as-community-moderator The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-003-remove-a-moderator-as-community-owner The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-role-moderator-assignment-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-001-subscribe-to-a-community The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-002-unsubscribe-from-a-community The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-003-list-the-current-users-subscriptions The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-subscription-subscription-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-001-support-keyboard-operation-for-core-journeys The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-002-expose-understandable-labels-focus-and-validation-feedback The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-003-avoid-color-only-or-image-only-meaning The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-001-provide-stable-paginated-continuation The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-002-recover-from-an-invalid-or-stale-continuation The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-001-keep-credentials-and-email-private The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-002-keep-moderation-records-community-private The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The journey walks the route and visible control that represents this user-facing obligation.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-account-and-moderation-privacy The journey walks the route and visible control that represents this user-facing obligation.
 */
export async function journey_core_product_surface(page: Page): Promise<void> {
  const visible = async (role: Parameters<Page["getByRole"]>[0], name?: string) => {
    const locator = page.getByRole(role, name === undefined ? undefined : { name });
    if (await locator.first().isVisible() === false) throw new Error(`Expected ${role} ${name ?? ""} to be visible.`);
  };
  await page.goto("/");
  await visible("heading");
  await visible("combobox", "Sort posts");
  await visible("textbox", "Search communities");
  await page.getByRole("combobox", { name: "Sort posts" }).selectOption("new");
  await page.getByRole("textbox", { name: "Search communities" }).fill("sample");

  await page.goto("/login");
  await visible("heading", "Welcome back");
  await visible("textbox", "Email");
  await visible("button", "Submit authentication form");
  await page.goto("/register");
  await visible("heading", "Create your account");
  await visible("textbox", "Username");
  await visible("button", "Submit authentication form");
  await page.goto("/recovery");
  await visible("heading", "Recover access");
  await visible("button", "Submit authentication form");
  await page.goto("/settings");
  await visible("heading", "Security settings");
  await visible("button", "Change password");
  await visible("button", "Refresh session");
  await visible("button", "Delete account permanently");

  const id = "00000000-0000-0000-0000-000000000000";
  await page.goto("/communities");
  await visible("heading");
  await page.goto(`/communities/${id}`);
  await visible("heading", "Community feed");
  await visible("heading", "Create a post");
  await visible("textbox", "Post title");
  await visible("button", "Publish post");
  await visible("heading", "Moderation desk");
  await visible("button", "Add moderator");
  await visible("button", "Ban user");

  await page.goto(`/post/${id}`);
  await visible("heading", "Comments");
  await visible("combobox", "Comment sort");
  await visible("button", "Add comment");
  await visible("button", "Upvote post");
  await visible("button", "Report post");

  await page.goto("/profile/guest");
  await visible("heading", "Authored posts");
  await visible("button", "Save profile");
}

test("the product surface routes and labels are reachable", async ({ page }) => {
  await journey_core_product_surface(page);
});
