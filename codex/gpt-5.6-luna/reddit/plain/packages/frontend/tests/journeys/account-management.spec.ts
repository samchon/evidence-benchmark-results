import { expect, test, type Page } from "@playwright/test";

async function register(page: Page): Promise<{ email: string; password: string; username: string }> {
  const stamp = Date.now().toString();
  const username = `manage${stamp.slice(-10)}`;
  const email = `${username}@example.test`;
  const password = "management-password-123";
  await page.goto("/auth");
  await page.getByRole("tab", { name: "Create account" }).click();
  await page.locator("#email").fill(email);
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("form").getByRole("button", { name: "Create account", exact: true }).click();
  await page.getByRole("link", { name: username }).waitFor();
  return { email, password, username };
}

test("an account can continue, replace its password, end all sessions, and delete itself", async ({ page }) => {
  const account = await register(page);
  await page.goto("/auth");
  await page.getByRole("button", { name: "Continue current session" }).click();
  await page.getByRole("link", { name: account.username }).waitFor();

  const changedPassword = "management-password-456";
  await page.goto("/settings");
  await page.getByRole("textbox", { name: "Current password", exact: true }).fill(account.password);
  await page.getByLabel("New password").fill(changedPassword);
  await page.getByRole("button", { name: "Replace password" }).click();
  await page.getByText("Password changed; other sessions were revoked.").waitFor();

  await page.getByRole("button", { name: "Sign out everywhere" }).click();
  await page.getByRole("heading", { name: "Welcome back" }).waitFor();
  await page.locator("#email").fill(account.email);
  await page.locator("#password").fill(account.password);
  await page.locator("form").getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.locator("#password").fill(changedPassword);
  await page.locator("form").getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByRole("link", { name: account.username }).waitFor();

  await page.goto("/settings");
  await page.getByLabel("Current password to confirm deletion").fill(changedPassword);
  await page.getByRole("button", { name: "Delete my account" }).click();
  await page.getByRole("heading", { name: "Welcome back" }).waitFor();
  await expect(page.getByRole("link", { name: account.username })).toHaveCount(0);

  await page.locator("#email").fill(account.email);
  await page.locator("#password").fill(changedPassword);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("tab", { name: "Create account" }).click();
  await page.locator("#username").fill(account.username);
  await page.locator("#password").fill(changedPassword);
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});
