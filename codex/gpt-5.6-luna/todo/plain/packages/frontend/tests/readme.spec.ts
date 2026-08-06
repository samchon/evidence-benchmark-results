import { expect, test } from "@playwright/test";

test("captures the sign-in landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Todo desk" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tasks" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Sign in" }).first()).toBeVisible();
  await page.screenshot({
    path: "test-results/readme-scaffold.png",
    fullPage: true,
  });
});
