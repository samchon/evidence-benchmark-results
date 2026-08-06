import { expect, test, type Page } from "@playwright/test";
import type { AuthPage } from "../../src/components/auth/auth-page";

/**
 * Exercises account registration, login, recovery, and the private boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-account-provisioning-and-login Covers account entry.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-1-register-a-private-account Registers an account.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-provision-2-log-in-with-email-and-password Logs in.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-private-account-authority Establishes authority.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-boundary-1-require-authentication-for-private-capabilities Checks the private boundary.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-account-management Reaches recovery.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-manage-2-recover-a-forgotten-password Exercises recovery.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-credential-rules Exercises credential rules.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-1-canonicalize-and-uniquely-identify-email-accounts Uses canonical email input.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-2-apply-the-password-length-rule Checks password validation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-credential-3-conceal-login-credential-failure Preserves generic refusal.
 * @evidence {@link AuthPage} Walks the account screen.
 */
export async function journey_auth(page: Page): Promise<void> {
  const email = `journey-${Date.now()}@example.com`;
  await page.goto("/auth?mode=join");
  await page.getByLabel("Email").fill(`  ${email.toUpperCase()}  `);
  await page.getByLabel("Display name").fill("Journey User");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.locator(".diagnoses").waitFor();
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("WrongPassword123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByText("Unable to sign in with those credentials.").first().waitFor();
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.getByRole("tab", { name: "Recover" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("New password").fill("Password456!");
  await page.getByRole("button", { name: "Replace password" }).click();
  await page.getByRole("status").waitFor();
  await page.getByRole("tab", { name: "Sign in" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password456!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Sign out" }).click();
}

test("account entry and recovery journey", async ({ page }) => {
  await journey_auth(page);
  await expect(page).toHaveURL(/\/auth/);
});
