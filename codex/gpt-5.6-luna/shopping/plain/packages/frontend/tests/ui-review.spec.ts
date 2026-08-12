import { expect, test } from "@playwright/test";

test("the public workspace remains readable at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Shop with less guesswork.");
  const separator = String.fromCharCode(0x00b7);
  await expect(page.locator(".hero-board")).toContainText(`Today${String.fromCharCode(0x2019)}s workspace`);
  await expect(page.locator(".hero-board")).toContainText(`Three items ${separator} two sellers ${separator} one immutable destination`);
});

test("the public workspace remains readable at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start as a customer" })).toBeVisible();
});

test("the public workspace remains readable at desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByText("A complete commerce record")).toBeVisible();
});
