import { expect, test } from "@playwright/test";

/** Account journey for REQ-AUTH-MGMT-001/003/004 and session controls. */
test("account controls are understandable when opened", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Sign in required" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link", { name: "Sign in" })).toBeVisible();
  await page.getByRole("main").getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
