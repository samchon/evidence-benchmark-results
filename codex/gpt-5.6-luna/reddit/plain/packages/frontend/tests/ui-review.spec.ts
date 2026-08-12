import { expect, test, type Page } from "@playwright/test";

async function inspectRoute(page: Page, path: string, heading: string): Promise<void> {
  await page.goto(path);
  await page.getByRole("banner").waitFor();
  await page.getByRole("heading", { name: heading, exact: true }).waitFor();
  await page.locator("main").scrollIntoViewIfNeeded();
}

test("desktop routes remain readable and named", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await inspectRoute(page, "/", "Sign in required");
  await inspectRoute(page, "/popular", "Popular everywhere");
  await inspectRoute(page, "/communities", "Communities");
  await inspectRoute(page, "/auth", "Welcome back");
  await expect(page.getByRole("heading", { name: "Welcome back", exact: true })).toBeVisible();
});

test("tablet navigation remains readable", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await inspectRoute(page, "/popular", "Popular everywhere");
  await expect(page.getByRole("link", { name: "Communities", exact: true })).toBeVisible();
});

test("phone navigation remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await inspectRoute(page, "/auth", "Welcome back");
  await page.getByRole("tab", { name: "Create account" }).click();
  await expect(page.locator("#username")).toBeVisible();
});
