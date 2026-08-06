import { expect, test } from "@playwright/test";

test("guide exposes live health state", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "A slower, kinder front page" })).toBeVisible();
  await expect(page.getByText("Backend health")).toBeVisible();
  await expect(page.locator(".health-line strong")).toHaveText("OK");
});

test("moderation stays private without a scoped session", async ({ page }) => {
  await page.goto("/community/00000000-0000-0000-0000-000000000000/moderation");
  await expect(page.getByRole("heading", { name: "Moderation desk" })).toBeVisible();
  await expect(page.getByText("private", { exact: true })).toBeVisible();
});
