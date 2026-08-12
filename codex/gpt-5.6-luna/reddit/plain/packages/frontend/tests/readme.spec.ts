import { expect, test } from "@playwright/test";

test("captures the public home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await page.screenshot({
    path: "test-results/readme-home.png",
    fullPage: true,
  });
});
