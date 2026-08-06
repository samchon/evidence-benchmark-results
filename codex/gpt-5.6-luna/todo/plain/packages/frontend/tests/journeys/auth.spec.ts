import { test, type Locator, type Page } from "@playwright/test";

async function assertVisible(locator: Locator, message: string): Promise<void> {
  try { await locator.waitFor({ state: "visible" }); } catch { throw new Error(message); }
}

export async function journey_auth(page: Page): Promise<void> {
  const email = `auth-${Date.now()}@example.com`;
  const password = "password123";
  await page.goto("/");
  await page.getByRole("heading", { name: "Todo desk" }).waitFor();
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Auth owner");
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await assertVisible(page.getByRole("heading", { name: "Tasks" }), "Registration did not open the private workspace.");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page.getByRole("button", { name: "Sign in" }).first().click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).last().click();
  await assertVisible(page.getByRole("heading", { name: "Tasks" }), "Login did not restore the private workspace.");
  await page.getByRole("button", { name: "Sign out" }).click();
  await assertVisible(page.getByRole("heading", { name: "Todo desk" }), "Logout did not return to anonymous entry.");
  await page.getByRole("button", { name: "Recover" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Start recovery" }).click();
  await assertVisible(page.getByLabel("Recovery proof"), "Recovery did not expose its proof step.");
  await page.getByLabel("New password").fill("recovered123");
  await page.getByRole("button", { name: "Replace password" }).click();
  await assertVisible(page.getByText("Password replaced. Sign in with your new password."), "Recovery did not confirm the replacement.");
  await page.getByLabel("Password").fill("recovered123");
  await page.getByRole("button", { name: "Sign in" }).last().click();
  await assertVisible(page.getByRole("heading", { name: "Tasks" }), "Recovered password did not restore the workspace.");
}

test("auth entry and recovery states are usable", async ({ page }) => {
  await journey_auth(page);
});
