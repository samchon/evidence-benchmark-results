import { expect, test, type Page } from "@playwright/test";

export async function journey_anonymous_refusal_and_recovery(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByText("Sign in required", { exact: true }).waitFor();
  await page.goto("/subscriptions");
  await page.getByText("Sign in required", { exact: true }).waitFor();
  await page.goto("/auth");
  await page.getByRole("tab", { name: "Recover", exact: true }).click();
  await page.locator("#email").fill("unknown@example.test");
  await page.getByRole("button", { name: "Send recovery request" }).click();
  await page.getByText("If the account exists, recovery instructions were sent.").waitFor();
}

test("anonymous readers receive private-session boundaries", async ({ page }) => {
  await journey_anonymous_refusal_and_recovery(page);
  await expect(page.getByText("If the account exists, recovery instructions were sent.")).toBeVisible();
});
