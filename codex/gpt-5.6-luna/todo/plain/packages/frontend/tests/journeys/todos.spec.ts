import { test, type Locator, type Page } from "@playwright/test";

async function assertVisible(locator: Locator, message: string): Promise<void> {
  try { await locator.waitFor({ state: "visible" }); } catch { throw new Error(message); }
}
async function assertText(locator: Locator, value: string, message: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if ((await locator.textContent())?.includes(value)) return;
    await new Promise<undefined>((resolve) => { setTimeout(() => resolve(undefined), 100); });
  }
  throw new Error(message);
}
async function assertInput(locator: Locator, value: string, message: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await locator.inputValue() === value) return;
    await new Promise<undefined>((resolve) => { setTimeout(() => resolve(undefined), 100); });
  }
  throw new Error(message);
}
async function assertAbsent(locator: Locator, message: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await locator.count() === 0) return;
    await new Promise<undefined>((resolve) => { setTimeout(() => resolve(undefined), 100); });
  }
  throw new Error(message);
}

export async function journey_todos(page: Page): Promise<void> {
  const live = process.env.VITE_API_SIMULATE !== "true";
  const title = `Prepare review ${Date.now()}`;
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).click();
  await page.getByLabel("Email").fill(`todo-${Date.now()}@example.com`);
  await page.getByLabel("Display name").fill("Todo owner");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByRole("heading", { name: "Tasks" }).waitFor();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description").fill("Verify the complete todo lifecycle.");
  await page.getByRole("button", { name: "Add task" }).click();
  await assertInput(page.getByLabel("Title"), "", "Successful creation did not clear the entry form.");
  if (live) {
    const row = page.getByRole("button", { name: new RegExp(title) });
    await assertVisible(row, "Created todo was not returned by the active list.");
    await row.click();
    await assertVisible(page.getByRole("heading", { name: title }), "Created todo detail was not reachable.");
    await page.locator(".detail").getByRole("button", { name: "Edit content" }).click();
    await page.locator(".detail").getByLabel("Title").fill(`${title} revised`);
    await page.getByRole("button", { name: "Save changes" }).click();
    await assertVisible(page.getByRole("heading", { name: `${title} revised` }), "Edited todo title was not persisted.");
    await page.getByRole("button", { name: "Mark complete" }).click();
    await assertText(page.locator(".detail"), "Complete", "Completion state was not reflected in detail.");
    await page.getByRole("button", { name: "Move to trash" }).click();
    await assertAbsent(page.getByRole("button", { name: new RegExp(`${title} revised`) }), "Trashed todo remained in the active list.");
    await page.getByRole("button", { name: "Trash", exact: true }).click();
    const trashRow = page.getByRole("button", { name: new RegExp(`${title} revised`) });
    await assertVisible(trashRow, "Trashed todo was not returned by the trash list.");
    await trashRow.click();
    await assertText(page.locator(".detail"), "In trash", "Trash detail did not expose trashed state.");
    await page.getByRole("button", { name: "Restore" }).click();
    await assertVisible(page.getByText("Trash is empty."), "Restored todo remained in trash.");
    await page.getByRole("button", { name: "Work" }).click();
    const terminalTitle = `Delete permanently ${Date.now()}`;
    await page.getByLabel("Title").fill(terminalTitle);
    await page.getByRole("button", { name: "Add task" }).click();
    const terminalRow = page.getByRole("button", { name: new RegExp(terminalTitle) });
    await assertVisible(terminalRow, "Terminal-delete todo was not created.");
    await terminalRow.click();
    await page.getByRole("button", { name: "Move to trash" }).click();
    await page.getByRole("button", { name: "Trash", exact: true }).click();
    await page.getByRole("button", { name: new RegExp(terminalTitle) }).click();
    await page.locator(".detail").getByRole("button", { name: "Delete permanently", exact: true }).click();
    await assertVisible(page.getByText("Trash is empty."), "Permanent deletion left the todo in trash.");
  }
  await page.getByRole("button", { name: "Trash", exact: true }).click();
  await page.getByRole("heading", { name: "Trash" }).waitFor();
}

test("todo and trash workspace journey", async ({ page }) => {
  await journey_todos(page);
});
