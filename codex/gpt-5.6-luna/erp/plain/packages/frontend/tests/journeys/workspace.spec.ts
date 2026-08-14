import { expect, test, type Page } from "@playwright/test";

export async function journey_workspace_create_and_operate(page: Page): Promise<void> {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const accountCode = `9${Date.now().toString().slice(-8)}`;
  const accountName = `Live Test Account ${suffix}`;
  const journalMemo = `Live journey entry ${suffix}`;
  const editedJournalMemo = `Edited live journey entry ${suffix}`;
  const email = process.env.LIVE_E2E_EMAIL;
  const password = process.env.LIVE_E2E_PASSWORD;
  if (email === undefined || password === undefined)
    throw new Error("LIVE_E2E_EMAIL and LIVE_E2E_PASSWORD must identify a separately prepared live owner.");
  await page.goto("/invitation");
  await page.getByLabel("Invitation token").fill("invalid-invitation-token");
  await page.getByLabel("Invitation email").fill("nobody@example.com");
  await page.getByLabel("Display name").fill("Rejected Invite");
  await page.getByLabel("Password").fill("RejectedInvite123!");
  await page.getByRole("button", { name: "Accept invitation" }).click();
  const invitationAlert = page.getByRole("alert");
  await invitationAlert.waitFor();
  if (!/invalid|expired|revoked|bound/i.test((await invitationAlert.textContent()) ?? ""))
    throw new Error("The invalid invitation refusal was not rendered as an actionable alert.");
  await page.goto("/login");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/select-organization$/);
  await page.getByLabel("Active organization").selectOption({ index: 0 });
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.waitForURL(/\/app$/);

  await page.getByRole("link", { name: "Accounts", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Accounts" }).waitFor();
  await page.getByLabel("Account code").fill(accountCode);
  await page.getByLabel("Account name").fill(accountName);
  await page.getByLabel("Account currency").fill("USD");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Search accounts").fill(accountName);
  await page.getByText(accountName).waitFor();
  const accountRow = page.getByRole("row").filter({ hasText: accountName });
  if (await accountRow.getByText("Active", { exact: true }).count() !== 1)
    throw new Error("The created account did not become active.");
  await accountRow.getByRole("button", { name: "Deactivate" }).click();
  await page.getByText(accountName, { exact: true }).waitFor({ state: "hidden" });
  if (await page.getByText(accountName, { exact: true }).count() !== 0)
    throw new Error("The deactivated account remained in the active chart.");

  await page.getByRole("link", { name: "Journals", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Journal workspace" }).waitFor();
  await page.getByLabel("Journal memo").fill(journalMemo);
  await page.getByLabel("Journal amount").fill("125");
  await page.getByLabel("Debit account").selectOption({ index: 1 });
  await page.getByLabel("Credit account").selectOption({ index: 2 });
  await page.getByRole("button", { name: "Save draft" }).click();
  await page.getByText(journalMemo, { exact: true }).waitFor();
  const journalRow = page.getByRole("row").filter({ hasText: journalMemo });
  await journalRow.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Edit journal memo").fill(editedJournalMemo);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByText(editedJournalMemo, { exact: true }).waitFor();
  const editableJournalRow = page.getByRole("row").filter({ hasText: editedJournalMemo });
  await editableJournalRow.getByRole("button", { name: "Post" }).click();
  const postedRow = page.getByRole("row").filter({ hasText: editedJournalMemo });
  await postedRow.getByText("posted", { exact: true }).waitFor();
  if (await postedRow.getByText("posted", { exact: true }).count() !== 1)
    throw new Error("The journal did not reach posted status.");
  await postedRow.getByRole("button", { name: "Reverse" }).first().waitFor();
  if (await postedRow.getByRole("button", { name: "Edit" }).count() !== 0)
    throw new Error("A posted journal remained editable.");

  await page.getByRole("link", { name: "Reports", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Reports" }).waitFor();
  await page.getByText("posted_debits", { exact: true }).waitFor();
  for (const filterLabel of ["Fiscal period ID", "Department ID", "Project ID", "Cost center ID", "Warehouse ID", "Customer ID", "Vendor ID", "Item ID", "Account ID", "Employee ID", "Currency", "Document status"])
    if (await page.getByLabel(filterLabel, { exact: true }).count() !== 1)
      throw new Error(`The report filter ${filterLabel} does not have one unique accessible control.`);
  const reportFrom = "2020-01-01T00:00";
  const reportFromApi = new Date(reportFrom).toISOString();
  await page.getByLabel("Report from").fill(reportFrom);
  await page.getByLabel("Currency", { exact: true }).fill("USD");
  await page.getByText("posted_debits", { exact: true }).waitFor();
  const exportResponse = page.waitForResponse((response) => response.url().endsWith("/erp/control/report/export") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Export report" }).click();
  const exported = await (await exportResponse).json() as { kind: string; filters: string; rows: Array<{ label: string; value: number }> };
  const postedDebits = exported.rows.find((row) => row.label === "posted_debits");
  if (exported.kind !== "trial_balance" || !exported.filters.includes(`\"from\":\"${reportFromApi}\"`) || !exported.filters.includes(`\"currency\":\"USD\"`) || postedDebits === undefined || postedDebits.value < 125)
    throw new Error("The report export did not preserve the selected report and filters.");
  const exportStatus = page.getByRole("status");
  await exportStatus.waitFor();
  if (!((await exportStatus.textContent()) ?? "").includes("Exported trial balance"))
    throw new Error("The report export success outcome was not rendered.");

  await page.getByRole("link", { name: "Operations", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Operations" }).waitFor();
  await page.getByText("Inventory view", { exact: true }).waitFor();
  await page.getByText("Trace stock identity", { exact: true }).waitFor();
  await page.getByText("Post an inventory adjustment", { exact: true }).waitFor();
  for (const fieldLabel of ["Adjustment item ID", "Adjustment warehouse ID", "Adjustment location ID", "Adjustment quantity", "Adjustment unit cost", "Adjustment reason"])
    if (await page.getByLabel(fieldLabel, { exact: true }).count() !== 1)
      throw new Error(`The live operations command ${fieldLabel} does not have one unique accessible control.`);
  const adjustmentItemId = process.env.LIVE_E2E_ITEM_ID;
  const adjustmentWarehouseId = process.env.LIVE_E2E_WAREHOUSE_ID;
  const adjustmentLocationId = process.env.LIVE_E2E_LOCATION_ID;
  if (adjustmentItemId === undefined || adjustmentWarehouseId === undefined || adjustmentLocationId === undefined)
    throw new Error("LIVE_E2E_ITEM_ID, LIVE_E2E_WAREHOUSE_ID, and LIVE_E2E_LOCATION_ID must identify prepared inventory dimensions.");
  for (const fieldLabel of ["Trace item ID", "Trace warehouse ID", "Trace location ID", "Trace lot ID", "Trace serial code"])
    if (await page.getByLabel(fieldLabel, { exact: true }).count() !== 1)
      throw new Error(`The stock trace command ${fieldLabel} does not have one unique accessible control.`);
  await page.getByLabel("Trace item ID", { exact: true }).fill(adjustmentItemId);
  await page.getByLabel("Trace warehouse ID", { exact: true }).fill(adjustmentWarehouseId);
  await page.getByLabel("Trace location ID", { exact: true }).fill(adjustmentLocationId);
  await page.getByRole("button", { name: "Search traceability" }).click();
  await page.getByText(/balance rows/).waitFor();
  await page.getByLabel("Adjustment item ID", { exact: true }).fill(adjustmentItemId);
  await page.getByLabel("Adjustment warehouse ID", { exact: true }).fill(adjustmentWarehouseId);
  await page.getByLabel("Adjustment location ID", { exact: true }).fill(adjustmentLocationId);
  await page.getByLabel("Adjustment quantity", { exact: true }).fill("1");
  await page.getByLabel("Adjustment unit cost", { exact: true }).fill("2");
  await page.getByLabel("Adjustment reason", { exact: true }).fill(`Live inventory adjustment ${suffix}`);
  await page.getByRole("button", { name: "Save adjustment" }).click();
  await page.getByRole("status").filter({ hasText: /Adjustment .*draft/ }).waitFor();
  await page.getByRole("button", { name: "Post adjustment" }).click();
  await page.getByRole("status").filter({ hasText: /Adjustment .*posted/ }).waitFor();

  await page.getByRole("link", { name: "People & projects", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "People workbench" }).waitFor();
  await page.getByText("Headcount rows", { exact: true }).waitFor();
  await page.getByText("Contract records", { exact: true }).waitFor();
  await page.getByText("Time status", { exact: true }).waitFor();

  await page.getByRole("link", { name: "Controls", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Controls and approvals" }).waitFor();
  const approvalTargetType = process.env.LIVE_E2E_APPROVAL_TARGET_TYPE;
  if (approvalTargetType === undefined)
    throw new Error("LIVE_E2E_APPROVAL_TARGET_TYPE must identify a separately prepared pending approval.");
  const approvalRow = page.locator(".activity-row").filter({ hasText: approvalTargetType });
  await approvalRow.getByRole("button", { name: "Approve" }).click();
  await page.getByRole("status").filter({ hasText: "Approval activity was recorded" }).waitFor();
  await page.getByRole("heading", { level: 2, name: "Approval history" }).waitFor();
  await page.getByText("approved", { exact: true }).last().waitFor();
  await page.getByText("organization.created", { exact: true }).waitFor();

  await page.getByRole("link", { name: "Planning", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Planning workbench" }).waitFor();
  await page.getByText("Recommendations", { exact: true }).waitFor();
  await page.getByText("Maintenance backlog", { exact: true }).waitFor();

  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Settings" }).waitFor();
  const updatedDisplayName = `Frontend Review Owner ${suffix}`;
  await page.getByLabel("Display name").fill(updatedDisplayName);
  await page.getByRole("button", { name: "Save profile" }).click();
  const displayNameInput = page.getByLabel("Display name");
  await displayNameInput.waitFor();
  if (await displayNameInput.inputValue() !== updatedDisplayName)
    throw new Error("The saved profile display name was not rendered after the update.");
  await page.getByRole("link", { name: "Accounts", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Accounts" }).waitFor();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("heading", { level: 1 }).filter({ hasText: "Settings" }).waitFor();
  const reloadedDisplayName = page.getByLabel("Display name");
  await reloadedDisplayName.waitFor();
  if (await reloadedDisplayName.inputValue() !== updatedDisplayName)
    throw new Error("The updated profile display name was not persisted after leaving the screen.");
}

test("a prepared organization must select context before the live workspace journey", async ({ page }) => {
  await journey_workspace_create_and_operate(page);
});

export async function journey_accept_prepared_invitation(page: Page): Promise<void> {
  const token = process.env.LIVE_E2E_INVITATION_TOKEN;
  const email = process.env.LIVE_E2E_INVITATION_EMAIL;
  if (token === undefined || email === undefined)
    throw new Error("LIVE_E2E_INVITATION_TOKEN and LIVE_E2E_INVITATION_EMAIL must identify a separately prepared active delivery.");
  await page.goto(`/invitation?token=${encodeURIComponent(token)}`);
  await page.getByLabel("Invitation email").fill(email);
  await page.getByLabel("Display name").fill("Live Invitation Recipient");
  await page.getByLabel("Password").fill("LiveInvitationRecipient123!");
  await page.getByRole("button", { name: "Accept invitation" }).click();
  await page.waitForURL(/\/select-organization$/);
  await page.getByRole("heading", { level: 2 }).filter({ hasText: "Select a workspace" }).waitFor();
  if (await page.getByLabel("Active organization").count() !== 1)
    throw new Error("Accepted invitation did not establish a selectable organization membership.");
}

test("a prepared active invitation establishes a membership before workspace selection", async ({ page }) => {
  await journey_accept_prepared_invitation(page);
});

test("public self-registration is not exposed", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.getByRole("heading", { name: "That page is not in this workspace" })).toBeVisible();
  await expect(page.getByText("Create a workspace")).toHaveCount(0);
});
