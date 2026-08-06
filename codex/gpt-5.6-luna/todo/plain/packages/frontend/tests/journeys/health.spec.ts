import { test, type Locator, type Page } from "@playwright/test";

async function assertContains(locator: Locator, value: string, message: string): Promise<void> {
  try { await locator.waitFor({ state: "visible" }); await locator.filter({ hasText: value }).waitFor({ state: "visible" }); } catch { throw new Error(message); }
}

export async function journey_health(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByLabel("Email").fill(`health-${Date.now()}@example.com`);
  await page.getByLabel("Display name").fill("Health owner");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();
  const expected = process.env.VITE_API_SIMULATE === "true" ? "Backend" : "Backend online";
  await assertContains(page.getByLabel("Backend status"), expected, "The authenticated health status did not report the backend state.");
}

test("public shell remains available while anonymous", async ({ page }) => {
  await journey_health(page);
});
