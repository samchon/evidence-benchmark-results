import { expect, test } from "@playwright/test";

/** Auth journey for REQ-AUTH-REG-001/003 and REQ-AUTH-MGMT-002. */
test("authentication journeys expose registration and recovery", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Make your mark" })).toBeVisible();
  await expect(page.getByLabel("Username")).toBeVisible();
  await page.getByRole("button", { name: "Recover" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await page.getByLabel("Email").fill("reader@example.com");
  await expect(page.getByRole("button", { name: "Send recovery proof" })).toBeVisible();
  await page.getByRole("button", { name: "Send recovery proof" }).click();
  await expect(page.getByRole("alert")).toContainText("recovery proof");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Email").fill(`journey-${Date.now()}@example.com`);
  await page.getByLabel("Username").fill(`journey_${Date.now()}`);
  await page.getByLabel("Password").fill("password-123");
  await page.locator("form").getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
});
