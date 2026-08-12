import { expect, test, type Browser, type Page } from "@playwright/test";

interface Credentials {
  email: string;
  password: string;
}

async function createAccount(page: Page): Promise<Credentials> {
  const email = `journey.${Date.now()}@example.test`;
  const password = "correct-horse-battery";
  await page.goto("/auth?mode=login");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByLabel("Display name").fill("Journey Owner");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create private workspace" }).click();
  await page.waitForURL(/\/app$/);
  return { email, password };
}

async function login(page: Page, credentials: Credentials): Promise<void> {
  await submitLogin(page, credentials);
  await page.waitForURL(/\/app$/);
}

async function submitLogin(page: Page, credentials: Credentials): Promise<void> {
  await page.goto("/auth?mode=login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.locator("form").getByRole("button", { name: "Sign in" }).click();
}

async function createTodo(page: Page, title: string, startDate = "2026-08-10", dueDate = "2026-08-12", description = "A journey description."): Promise<void> {
  await page.getByRole("button", { name: "New todo" }).click();
  let dialog = page.getByRole("dialog");
  if (await dialog.getByRole("button", { name: "Close dialog" }).evaluate((element) => document.activeElement === element) === false)
    throw new Error("The todo dialog did not focus its close control.");
  await page.keyboard.press("Escape");
  if (await dialog.isVisible()) throw new Error("Escape did not close the todo dialog.");
  await page.getByRole("button", { name: "New todo" }).click();
  dialog = page.getByRole("dialog");
  await dialog.locator("input").first().fill(title);
  await dialog.locator("textarea").fill(description);
  await dialog.locator("#start-date").fill(startDate);
  await dialog.locator("#due-date").fill(dueDate);
  await dialog.getByRole("button", { name: "Create todo" }).click();
}

test("register, create, edit with history, complete, trash, and restore", async ({ page }) => {
  await createAccount(page);
  await expect(page.getByRole("heading", { name: "Active todos" })).toBeVisible();
  await expect(page.getByText("Journey Owner", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Active todos" })).toBeVisible();
  await createTodo(page, "Journey launch brief");
  await expect(page.locator(".todo-row-main").filter({ hasText: "Journey launch brief" })).toBeVisible();
  await expect(page.getByText(/Start Aug 10, 2026/)).toBeVisible();
  await expect(page.getByText(/Created Aug 10, 2026/)).toBeVisible();
  await page.locator(".todo-row-main").first().click();
  await expect(page.getByText("No content edits yet.")).toBeVisible();
  await expect(page.getByText("A journey description.")).toBeVisible();
  await page.getByRole("button", { name: "Edit content" }).click();
  const panel = page.locator(".detail-panel");
  await panel.getByRole("button", { name: "Save changes" }).click();
  await expect(panel.getByRole("alert")).toHaveText(/Change at least one content field/);
  await expect(panel.getByRole("button", { name: "Save changes" })).toBeVisible();
  await panel.locator("input").first().fill("Journey launch brief revised");
  await panel.locator("textarea").fill("A revised journey description.");
  await panel.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("1 entries")).toBeVisible();
  await expect(page.getByText(/Title: Journey launch brief revised/)).toBeVisible();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Complete", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark in progress" }).click();
  await expect(page.locator(".detail-status").getByText("In progress", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Mark complete" }).click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await expect(page.getByText("A clear stretch ahead")).toBeVisible();
  await page.getByRole("link", { name: "Trash" }).click();
  await expect(page.getByText(/Moved Aug 10, 2026/)).toBeVisible();
  await page.locator(".todo-row-main").first().click();
  await expect(page.getByText("In trash", { exact: true })).toBeVisible();
  await expect(page.getByRole("main").getByText("Moved to trash")).toBeVisible();
  await expect(page.getByText(/Title: Journey launch brief revised/)).toBeVisible();
  await page.reload();
  await expect(page.getByText("In trash", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Restore todo" }).click();
  await expect(page.getByText("Trash is empty")).toBeVisible();
  await page.getByRole("link", { name: "Active todos" }).click();
  await expect(page.locator(".todo-row-main").filter({ hasText: "Journey launch brief revised" })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Active todos" })).toBeVisible();
  await page.getByRole("link", { name: "Trash" }).click();
  await expect(page.getByRole("heading", { name: "Trash", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Account" }).click();
  await expect(page.getByRole("heading", { name: "Account settings" })).toBeVisible();
});

test("filters, profile, password refusal, and session controls remain reachable", async ({ page }) => {
  const credentials = await createAccount(page);
  await createTodo(page, "Filterable journey todo");
  await expect(page.locator(".todo-row-main").filter({ hasText: "Filterable journey todo" })).toBeVisible();
  await page.getByLabel("Completion filter").selectOption("complete-only");
  await expect(page.getByText("This filter has no matching active todos.")).toBeVisible();
  await page.getByLabel("Completion filter").selectOption("incomplete-only");
  await expect(page.locator(".todo-row-main").filter({ hasText: "Filterable journey todo" })).toBeVisible();
  await page.getByLabel("Todo sort").selectOption("start-desc");
  await expect(page).toHaveURL(/sort=start-desc/);
  await page.getByLabel("Todo sort").selectOption("due-desc");
  await expect(page).toHaveURL(/sort=due-desc/);
  await page.getByRole("link", { name: "Account" }).click();
  await expect(page.getByRole("heading", { name: "Account settings" })).toBeVisible();
  await page.getByLabel("Display name").fill("Journey Owner Updated");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByLabel("Display name")).toHaveValue("Journey Owner Updated");
  await expect(page.getByText("Journey Owner Updated", { exact: true })).toBeVisible();
  const passwords = page.locator("input[type=password]");
  await passwords.nth(0).fill("wrong-current-password");
  await passwords.nth(1).fill("new-valid-password");
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByText(/could not|refused|password/i).first()).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("button", { name: "Sign out everywhere" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out here" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await login(page, credentials);
  await expect(page.locator(".todo-row-main").filter({ hasText: "Filterable journey todo" })).toBeVisible();
});

test("changing a password invalidates the old credential and accepts the new one", async ({ page }) => {
  const credentials = await createAccount(page);
  const replacement = { ...credentials, password: "new-correct-password" };
  await page.getByRole("link", { name: "Account" }).click();
  const passwords = page.locator("input[type=password]");
  await passwords.nth(0).fill(credentials.password);
  await passwords.nth(1).fill(replacement.password);
  await page.getByRole("button", { name: "Change password" }).click();
  await expect(page.getByText(/Password changed/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await submitLogin(page, credentials);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(/invalid|credential|could not/i).first()).toBeVisible();
  await login(page, replacement);
  await expect(page.getByRole("heading", { name: "Active todos" })).toBeVisible();
});

test("unknown and wrong-password login refusals remain indistinguishable", async ({ page }) => {
  const credentials = await createAccount(page);
  await page.getByRole("link", { name: "Account" }).click();
  await page.getByRole("button", { name: "Sign out here" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await submitLogin(page, { email: "unknown-login@example.test", password: credentials.password });
  const unknownMessage = await page.locator(".inline-error").textContent();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await submitLogin(page, { email: credentials.email, password: "wrong-login-password" });
  const wrongPasswordMessage = await page.locator(".inline-error").textContent();
  expect(unknownMessage).not.toBeNull();
  expect(wrongPasswordMessage).toBe(unknownMessage);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});

test("description values and refused profile edits preserve the business outcome", async ({ page }) => {
  const credentials = await createAccount(page);
  await createTodo(page, "Whitespace description todo", "2026-08-10", "2026-08-12", "  Preserve these edges  ");
  await page.locator(".todo-row-main").first().click();
  await expect.poll(async () => page.locator(".detail-description").textContent()).toBe("  Preserve these edges  ");
  await page.getByRole("link", { name: "Account" }).click();
  await page.getByLabel("Display name").fill("   ");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText(/Display name must be 1 to 100 characters/)).toBeVisible();
  await page.getByRole("button", { name: "Sign out here" }).click();
  await login(page, credentials);
  await expect(page.getByText("Journey Owner", { exact: true })).toBeVisible();
});

test("recovery keeps the generic refusal surface", async ({ page }) => {
  await page.goto("/auth?mode=login");
  await page.getByRole("button", { name: "Forgot your password?" }).click();
  await page.getByLabel("Email").fill("unknown@example.test");
  await page.getByRole("button", { name: "Send recovery instructions" }).click();
  await expect(page.getByText(/If that account exists/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Set a new password" })).toBeVisible();
  await page.getByRole("button", { name: "Request another proof" }).click();
  await expect(page.getByRole("heading", { name: "Recover your account" })).toBeVisible();
});

test("permanently erases a trashed todo after confirmation", async ({ page }) => {
  await createAccount(page);
  await createTodo(page, "Erase me from the journey");
  await page.locator(".todo-row-main").first().click();
  await page.getByRole("button", { name: "Move to trash" }).click();
  await page.getByRole("link", { name: "Trash" }).click();
  await expect(page.locator(".todo-row-main").first()).toBeVisible();
  await page.locator(".todo-row-main").first().click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Erase permanently" }).click();
  await expect(page.getByText("Trash is empty")).toBeVisible();
});

test("invalid planning dates are refused without creating a todo", async ({ page }) => {
  await createAccount(page);
  await page.getByRole("button", { name: "New todo" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Title").fill("Invalid planning interval");
  await dialog.getByLabel("Start date").fill("2026-08-20");
  await dialog.getByLabel("Due date").fill("2026-08-10");
  await dialog.getByRole("button", { name: "Create todo" }).click();
  await expect(dialog.getByRole("alert")).toHaveText(/Due date must be on or after/);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("Invalid planning interval", { exact: true })).toHaveCount(0);
});

test("date sorting, pagination, and URL state preserve the selected active view", async ({ page }) => {
  await createAccount(page);
  await createTodo(page, "Early dated todo", "2026-08-10", "2026-08-12");
  await createTodo(page, "Late dated todo", "2026-08-20", "2026-08-22");
  await page.getByLabel("Todo sort").selectOption("start-asc");
  await expect(page).toHaveURL(/sort=start-asc/);
  await expect(page.locator(".todo-row-main").nth(0)).toContainText("Early dated todo");
  await expect(page.locator(".todo-row-main").nth(1)).toContainText("Late dated todo");
  await page.getByLabel("Todo sort").selectOption("start-desc");
  await expect(page.locator(".todo-row-main").nth(0)).toContainText("Late dated todo");
  await expect(page.locator(".todo-row-main").nth(1)).toContainText("Early dated todo");
  for (let index = 3; index <= 9; index += 1)
    await createTodo(page, `Page todo ${index}`, "2026-08-10", "2026-08-12");
  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  await expect(page.locator(".todo-row-main")).toHaveCount(1);
  await page.reload();
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
});

test("signing out everywhere invalidates another live session", async ({ page, browser }) => {
  const credentials = await createAccount(page);
  const second = await browser.newPage();
  await login(second, credentials);
  await page.getByRole("link", { name: "Account" }).click();
  await page.getByRole("button", { name: "Sign out everywhere" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await second.goto("/app");
  await expect(second.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await second.close();
});

test("a stale editor refuses to overwrite a newer version", async ({ page, browser }) => {
  const credentials = await createAccount(page);
  await createTodo(page, "Versioned journey todo");
  await page.locator(".todo-row-main").first().click();
  await page.getByRole("button", { name: "Edit content" }).click();

  const second = await browser.newPage();
  await login(second, credentials);
  await second.locator(".todo-row-main").first().click();
  await second.getByRole("button", { name: "Edit content" }).click();
  const secondPanel = second.locator(".detail-panel");
  await secondPanel.locator("input").first().fill("Newer version from another session");
  await secondPanel.locator("textarea").fill("The newer description wins.");
  await secondPanel.getByRole("button", { name: "Save changes" }).click();
  await expect(second.getByText("1 entries")).toBeVisible();

  const firstPanel = page.locator(".detail-panel");
  await firstPanel.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/stale|version|changed|reload/i).first()).toBeVisible();
  await expect(firstPanel.getByRole("button", { name: "Save changes" })).toBeVisible();
  await page.reload();
  await page.locator(".todo-row-main").first().click();
  await expect(page.locator(".detail-panel h2")).toHaveText("Newer version from another session");
  await expect(page.getByText(/Title: Newer version from another session/)).toBeVisible();
  await second.close();
});

test("deletes the account after password confirmation", async ({ page }) => {
  const credentials = await createAccount(page);
  await page.getByRole("link", { name: "Account" }).click();
  await page.getByLabel("Confirm with current password").fill(credentials.password);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Permanently delete account" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await submitLogin(page, credentials);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText(/invalid|credential|could not/i).first()).toBeVisible();
});

test("accounts cannot see each other's active todos", async ({ page }) => {
  await createAccount(page);
  await createTodo(page, "Private first-account todo");
  await page.getByRole("link", { name: "Account" }).click();
  await page.getByRole("button", { name: "Sign out here" }).click();
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await createAccount(page);
  await expect(page.locator(".todo-row-main").filter({ hasText: "Private first-account todo" })).toHaveCount(0);
});
