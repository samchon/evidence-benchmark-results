import { expect, test } from "@playwright/test";

test("the discover screen remains readable at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeInViewport();
});

test("the discover screen remains readable at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeInViewport();
});

test("the discover screen remains readable at desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeInViewport();
});
