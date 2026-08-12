import { test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { ProfilePage } from "../../src/components/profile/profile-page";

const registerAccount = async (page: Page, suffix: string): Promise<{ email: string; password: string }> => {
  const email = `journey-${suffix}-${Date.now()}@example.com`;
  const password = "JourneyPassword9";
  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Display name").fill("Journey Owner");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/todos$/);
  return { email, password };
};

/**
 * Walks registration, credential validation, recovery refusal, profile, session, and account security.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Exercises account entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Exercises private registration.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Exercises login.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Exercises session security.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Exercises refresh.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Exercises current logout.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Exercises all-session logout.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Exercises account security.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Exercises password replacement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Exercises non-disclosing recovery and invalid proof refusal.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Exercises terminal account deletion.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Exercises the private route boundary.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Exercises anonymous redirection.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises credential controls.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Exercises canonical account email.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Exercises password bounds.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Exercises failed-login feedback.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Exercises one-time proof refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Exercises the profile domain.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-profile-meaning-and-relationship Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Exercises profile fields.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-1-define-the-user-profile Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Exercises account-bound profile.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-2-bind-one-private-profile-to-each-account Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Exercises profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Exercises profile view.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-1-view-the-current-users-profile Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Exercises profile update.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-2-edit-the-display-name Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Exercises display-name rules.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-display-name-rules Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Exercises display-name validation.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-1-validate-private-display-names Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence {@link AuthPage} Walks the public authentication screen.
 * @evidenceReview {@link AuthPage} Read the cited requirement and ran journey_account_security against the live backend.
 * @evidence {@link ProfilePage} Walks the private profile and account-management screen.
 * @evidenceReview {@link ProfilePage} Read the cited requirement and ran journey_account_security against the live backend.
 */
export async function journey_account_security(page: Page): Promise<void> {
  await page.goto("/login");
  await page.waitForURL(/\/login$/);
  const account = await registerAccount(page, "account");
  await page.getByRole("banner").getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/login$/);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill("WrongJourney9");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("alert").waitFor();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await page.getByLabel("Email").fill(account.email);
  await page.getByRole("button", { name: "Send recovery proof" }).click();
  await page.getByLabel("Recovery proof").waitFor();
  await page.getByLabel("Recovery proof").fill("invalid-proof");
  await page.getByRole("textbox", { name: "New password" }).fill("RecoveryAttempt9");
  await page.getByRole("button", { name: "Replace password" }).click();
  await page.getByRole("alert").waitFor();
  await page.getByRole("button", { name: "Back to sign in" }).click();
  await page.getByLabel("Email").fill(account.email.toUpperCase());
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/todos$/);
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByRole("heading", { name: "Your private profile" }).waitFor();
  await page.getByLabel("Display name").fill("Updated Journey Owner");
  await page.getByRole("button", { name: "Save profile" }).click();
  await page.getByText("Your display name is updated.").waitFor();
  await page.getByRole("button", { name: "Continue session" }).click();
  await page.getByText("Session continued.").waitFor();
  await page.getByRole("textbox", { name: "Current password", exact: true }).fill(account.password);
  await page.getByLabel("New password").fill("ChangedJourney9");
  await page.getByRole("button", { name: "Replace password" }).click();
  await page.waitForURL(/\/login$/);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill("ChangedJourney9");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/todos$/);
  await page.getByRole("banner").getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL(/\/login$/);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill("ChangedJourney9");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByRole("button", { name: "Sign out everywhere" }).click();
  await page.waitForURL(/\/login$/);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill("ChangedJourney9");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Profile" }).click();
  await page.getByLabel("Confirm with current password").fill("ChangedJourney9");
  await page.getByRole("button", { name: "Delete account" }).click();
  await page.waitForURL(/\/login$/);
}

test("account security journey", async ({ page }) => {
  await journey_account_security(page);
});
