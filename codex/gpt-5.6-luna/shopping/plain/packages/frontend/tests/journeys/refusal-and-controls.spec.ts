import { expect, test } from "@playwright/test";

test("administrator route keeps its explicit backend refusal state for a regular customer", async ({ page }) => {
  await page.goto("/register/customer");
  await page.getByLabel("Email").fill(`refusal.${Date.now()}@example.test`);
  await page.getByLabel("Password").fill("CustomerPass123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/app$/u);
  await page.goto("/app/admin");
  await expect(page.getByRole("heading", { name: "We could not load this view" })).toBeVisible();
});
