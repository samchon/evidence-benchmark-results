import { expect, test } from "@playwright/test";

test("captures the public authentication page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await page.screenshot({
    path: "test-results/readme-auth.png",
    fullPage: true,
  });
});
