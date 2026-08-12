import { test, type Page } from "@playwright/test";

import { OperationsPage } from "../../src/components/operations/operations-page";

/**
 * Walks the primary workspace flow and its refusal and empty states.
 * @evidence {@link OperationsPage} Walks the delivered operational screen.
 * @evidenceReview {@link OperationsPage} Read the complete screen and ran the live journey, verifying navigation, health status, domain filtering, empty/refusal states, and form validation.
 */
export async function journey_operations(page: Page): Promise<void> {
  const response = await page.goto("/");
  if (response === null) throw new Error("Navigation returned no response.");
  if (response.ok() === false) throw new Error(`Navigation failed with status ${response.status()}.`);
  const heading = page.getByRole("heading", { level: 1 });
  await heading.waitFor();
  if ((await heading.textContent())?.includes("Good morning") !== true)
    throw new Error("The workspace heading did not render.");
  await page.getByRole("button", { name: "Check API" }).click();
  await page.getByText("Connected").waitFor();
  await page.getByRole("tab", { name: "Finance" }).click();
  const financeRow = page.getByRole("row").filter({ hasText: "Period close readiness" });
  await financeRow.waitFor();
  await page.getByRole("textbox", { name: "Filter work" }).fill("does-not-exist");
  const emptyHeading = page.getByRole("heading", { level: 3 });
  await emptyHeading.waitFor();
  if ((await emptyHeading.textContent())?.includes("No matching work") !== true)
    throw new Error("The filtered empty state did not render.");
  await page.getByRole("button", { name: "Clear filter" }).click();
  await page.getByLabel("Inspect presentation state").selectOption("refusal");
  const refusal = page.getByRole("alert");
  await refusal.waitFor();
  if ((await refusal.textContent())?.includes("Access limited") !== true)
    throw new Error("The refusal state did not render.");
  await page.getByLabel("Inspect presentation state").selectOption("ready");
  await page.getByRole("button", { name: "New work" }).click();
  await page.getByRole("textbox", { name: "Organization name" }).fill("A");
  await page.getByRole("button", { name: "Create organization" }).click();
  const validation = page.getByRole("status");
  await validation.waitFor();
  if ((await validation.textContent())?.includes("at least two characters") !== true)
    throw new Error("The form validation message did not render.");
}

test("the operational workspace supports queue and refusal flows", async ({ page }) => {
  await journey_operations(page);
});
