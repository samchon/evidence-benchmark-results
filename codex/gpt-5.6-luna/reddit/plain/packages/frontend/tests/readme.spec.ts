import { expect, test } from "@playwright/test";

test("captures the discover landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeVisible();
  await page.screenshot({
    path: "test-results/readme-discover.png",
    fullPage: true,
  });
});
