import { expect, test } from "@playwright/test";

test("captures the scaffold landing page", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await page.screenshot({
    path: "test-results/readme-scaffold.png",
    fullPage: true,
  });
});
