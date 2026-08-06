import { expect, test } from "@playwright/test";

test("the scaffold remains readable at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".content")).toBeInViewport();
});

test("the scaffold remains readable at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".content")).toBeInViewport();
});

test("the scaffold remains readable at desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".content")).toBeInViewport();
});
