import { expect, test, type Page } from "@playwright/test";

async function selectFirstMembership(page: Page): Promise<void> {
  await page.goto("/profile");
  await page.getByRole("heading", { name: "Profile and access" }).waitFor({ state: "visible" });
  const button = page.getByRole("button", { name: /^Use / }).first();
  if (await button.count()) {
    await button.click();
    await page.waitForFunction(() => {
      const raw = localStorage.getItem("benchmark-erp.auth");
      if (!raw) return false;
      try {
        return Boolean((JSON.parse(raw) as { activeMembershipId?: string }).activeMembershipId);
      } catch {
        return false;
      }
    });
  }
}

async function ensureWorkspace(page: Page): Promise<void> {
  if (process.env.VITE_API_SIMULATE !== "true") {
    await journey_profile_access(page);
    return;
  }
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/$/);
  await selectFirstMembership(page);
}

export async function journey_dashboard_navigation(page: Page): Promise<void> {
  await ensureWorkspace(page);
  await page.goto("/");
  await page.getByRole("heading", { name: /workspace is in rhythm/i }).waitFor({ state: "visible" });
  await page.locator("nav").getByRole("link", { name: /Vendors/ }).click();
  await page.getByPlaceholder("Search vendors").fill("Northwind");
  await page.getByRole("link", { name: "Return to workspace" }).click();
}

export async function journey_authentication(page: Page): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("demo@example.com");
  await page.goto("/recover");
  await page.getByRole("heading", { name: "Restore access" }).waitFor({ state: "visible" });
  await page.goto("/invite");
  await page.getByRole("heading", { name: "Join your organization" }).waitFor({ state: "visible" });
  await page.goto("/login");
}
export async function journey_profile_access(page: Page): Promise<void> {
  if (process.env.VITE_API_SIMULATE === "true") {
    await page.goto("/login");
    await page.getByLabel("Email address").fill("demo@example.com");
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL(/\/$/);
    await selectFirstMembership(page);
    await page.goto("/modules/vendor");
    await page.getByRole("heading", { name: "Vendors" }).waitFor({ state: "visible" });
    return;
  }
  const apiHost = process.env.VITE_API_HOST ?? "http://127.0.0.1:47123";
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const email = `journey-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  const created = await page.request.post(`${apiHost}/auth/user`, { data: { email, password, displayName: "Journey Owner" } });
  if (!created.ok()) throw new Error(`user provisioning failed with ${created.status()}`);
  const logged = await page.request.post(`${apiHost}/auth/user/login`, { data: { email, password } });
  if (!logged.ok()) throw new Error(`login provisioning failed with ${logged.status()}: ${await logged.text()}`);
  const authorization = `Bearer ${(await logged.json()).accessToken as string}`;
  const organization = await page.request.post(`${apiHost}/organization`, { headers: { Authorization: authorization }, data: { name: `Journey ${suffix}`, code: `journey-${suffix}`, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Journey Owner" } });
  if (!organization.ok()) throw new Error(`organization provisioning failed with ${organization.status()}`);
  const organizationId = (await organization.json()).id as string;
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/$/);
  await selectFirstMembership(page);
  await page.goto("/profile");
  await page.getByRole("heading", { name: "Profile and access" }).waitFor({ state: "visible" });
  await page.getByRole("button", { name: `Use ${organizationId}` }).click();
  await page.goto("/modules/vendor");
  const syncState = await page.locator(".sync-state").textContent();
  if (!syncState || !/Synced just now|Refreshing/.test(syncState)) throw new Error("live vendor query did not reach a sync state");
}
export async function journey_module_workspace(page: Page): Promise<void> {
  await ensureWorkspace(page);
  await page.goto("/modules/reports");
}

test("dashboard to module journey", async ({ page }) => { await journey_dashboard_navigation(page); await expect(page.getByRole("heading", { name: /workspace is in rhythm/i })).toBeVisible(); });
test("protected workspace refuses anonymous access", async ({ page }) => { await page.goto("/"); await expect(page).toHaveURL(/\/login$/); await expect(page.getByRole("heading", { name: "Sign in to your workspace" })).toBeVisible(); });
test("authentication journey", async ({ page }) => { await journey_authentication(page); await expect(page.getByRole("heading", { name: /sign in to your workspace/i })).toBeVisible(); await expect(page.getByRole("button", { name: "Sign in" })).toBeEnabled(); });
test("profile and access live organization journey", async ({ page }) => { await journey_profile_access(page); await expect(page.getByRole("heading", { name: "Vendors" })).toBeVisible(); });
test("module workspace journey", async ({ page }) => { await journey_module_workspace(page); await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible(); await expect(page.getByRole("button", { name: /create reports/i })).toHaveCount(0); await expect(page.getByRole("button", { name: "Export records" })).toBeVisible(); });
test("published operations catalog validates arguments", async ({ page }) => { await ensureWorkspace(page); await page.goto("/operations"); await expect(page.getByRole("heading", { name: "Published operations" })).toBeVisible(); await expect(page.getByText("557 operations")).toBeVisible(); await page.getByLabel("Arguments").fill("not-json"); await page.getByRole("button", { name: "Run operation" }).click(); await expect(page.getByRole("alert")).toContainText("Unexpected token"); });
