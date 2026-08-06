import { expect, test } from "@playwright/test";

/** Community journey for REQ-FUNC-POST, REQ-FUNC-COMMENT, REQ-FUNC-VOTE, and reporting. */
test("community participation path is reachable", async ({ page }) => {
  await page.goto("/discover");
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeVisible();
  await page.getByRole("link", { name: "Join the conversation" }).click();
  await expect(page.getByRole("heading", { name: /Welcome back|Make your mark/ })).toBeVisible();
  await page.goto("/discover");
  await expect(page.getByRole("heading", { name: "Find your people" })).toBeVisible();
  const community = page.locator("a.community-row").first();
  await expect(community).toBeVisible();
  await community.click();
  await expect(page.getByRole("heading", { name: "Participate" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in to post" })).toBeVisible();
  await page.getByRole("link", { name: "Sign in to post" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
