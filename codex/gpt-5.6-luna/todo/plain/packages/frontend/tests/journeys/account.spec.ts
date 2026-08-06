import { test, type Locator, type Page } from "@playwright/test";

async function assertVisible(locator: Locator, message: string): Promise<void> {
  try { await locator.waitFor({ state: "visible" }); } catch { throw new Error(message); }
}

export async function journey_account(page: Page): Promise<void> {
  const email = `account-${Date.now()}@example.com`;
  const password = "password123";
  const replacement = "replacement123";
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Account owner");
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("button", { name: "Account" }).click();
  await assertVisible(page.getByRole("heading", { name: "Change password" }), "Password controls are unavailable.");
  await page.getByLabel("Display name").fill("Account owner revised");
  await page.getByRole("button", { name: "Save profile" }).click();
  if (process.env.VITE_API_SIMULATE === "true") {
    if (await page.getByLabel("Display name").inputValue() !== "Account owner revised") throw new Error("Profile edit was not retained in the form.");
  } else {
    await assertVisible(page.getByRole("heading", { name: "Account owner revised" }), "Profile update did not become visible.");
  }
  await assertVisible(page.getByRole("button", { name: "Sign out everywhere" }), "Session controls are unavailable.");
  await page.getByLabel("Current password").nth(0).fill(password);
  await page.getByLabel("New password").fill(replacement);
  await page.getByRole("button", { name: "Replace password" }).click();
  await assertVisible(page.getByRole("heading", { name: "Todo desk" }), "Password replacement did not end the old session.");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(replacement);
  await page.getByRole("button", { name: "Sign in" }).last().click();
  await page.getByRole("button", { name: "Work", exact: true }).click();
  await assertVisible(page.getByRole("heading", { name: "Tasks" }), "Replacement password could not restore the workspace.");
  await page.getByRole("button", { name: "Account" }).click();
  page.once("dialog", (dialog) => void dialog.accept());
  await page.getByLabel("Current password").nth(1).fill(replacement);
  await page.getByRole("button", { name: "Delete account permanently" }).click();
  await assertVisible(page.getByRole("heading", { name: "Todo desk" }), "Account deletion did not end the private session.");
}

test("profile, security, and session controls are reachable", async ({ page }) => {
  await journey_account(page);
});
