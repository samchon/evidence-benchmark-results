import { expect, test } from "@playwright/test";

test("protected routes redirect anonymous users to account access", async ({ page }) => {
  await page.goto("/app/orders");
  await expect(page).toHaveURL(/\/login$/u);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
