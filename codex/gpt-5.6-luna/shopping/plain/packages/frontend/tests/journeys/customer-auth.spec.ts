import { expect, test, type Page } from "@playwright/test";

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}@example.test`;
}

test("customer registration establishes and clears a live session", async ({ page }) => {
  const email = uniqueEmail("customer");
  await page.goto("/register/customer");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("CustomerPass123!");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/app$/u);
  await page.getByRole("link", { name: "Profile", exact: true }).click();
  await page.getByLabel("Display name").fill("Ari Shopper");
  await page.getByLabel("Phone number").fill("555-0101");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText("Profile updated.");
  await page.reload();
  await expect(page.getByLabel("Display name")).toHaveValue("Ari Shopper");
  await expect(page.getByLabel("Phone number")).toHaveValue("555-0101");
  await page.getByRole("button", { name: "Sign out" }).first().click();
  await expect(page).toHaveURL(/\/login$/u);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("CustomerPass123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/app$/u);
  await expect(page.getByRole("link", { name: "Profile", exact: true })).toBeVisible();
});
