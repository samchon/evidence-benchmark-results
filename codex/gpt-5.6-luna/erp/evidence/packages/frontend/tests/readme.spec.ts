import { expect, test } from "@playwright/test";

test("captures the operations workspace landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Good morning, Alex");
  await page.screenshot({
    path: "test-results/readme-workspace.png",
    fullPage: true,
  });
});
