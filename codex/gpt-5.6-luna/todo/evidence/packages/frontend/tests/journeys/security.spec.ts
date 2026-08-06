import { expect, test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";
import type { SecurityPage } from "../../src/components/security/security-page";

/**
 * Exercises session continuity and terminal account controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-continuity-and-logout Covers session controls.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-1-continue-an-authenticated-session Renews a session.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-2-log-out-the-current-session Logs out.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-3-log-out-all-sessions Ends all sessions.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Covers account management.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-1-change-the-account-password Changes password.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-3-permanently-delete-the-account Deletes account.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-4-secure-credential-replacement Preserves replacement safety.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-3-complete-permanent-deletion-as-one-outcome Covers terminal outcome.
 * @evidence {@link AuthPage} Enters the private boundary.
 * @evidence {@link SecurityPage} Walks security controls.
 */
export async function journey_security(page: Page): Promise<void> {
  const email = `security-${Date.now()}@example.com`;
  await page.goto("/auth?mode=join");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Security Journey");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("link", { name: "Security" }).click();
  await page.getByRole("button", { name: "Refresh session" }).click();
  await page.getByRole("button", { name: "Log out this session" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Security" }).click();
  await page.getByRole("button", { name: "Log out all sessions" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Security" }).click();
  await page.getByRole("textbox", { name: "Current password", exact: true }).fill("Password123!");
  await page.getByRole("textbox", { name: "New password", exact: true }).fill("Password456!");
  await page.getByRole("button", { name: "Change password" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password456!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("link", { name: "Security" }).click();
  await page.getByLabel("Confirm with current password").fill("Password456!");
  await page.getByRole("button", { name: "Permanently close account" }).click();
}

test("security journey", async ({ page }) => {
  await journey_security(page);
  await expect(page).toHaveURL(/\/auth/);
});
