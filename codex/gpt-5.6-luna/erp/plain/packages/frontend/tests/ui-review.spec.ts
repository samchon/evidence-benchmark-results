import { expect, test, type Page } from "@playwright/test";

const authenticatedSession = {
  user: { id: "00000000-0000-4000-8000-000000000001", email: "review@example.com", displayName: "Review Owner", avatar: null, phone: null, locale: "en-US", timezone: "UTC", status: "active" },
  accessToken: "review-access-token",
  accessExpiresAt: "2099-01-01T00:00:00.000Z",
  refreshToken: "review-refresh-token",
  memberships: [{ id: "00000000-0000-4000-8000-000000000002", organizationId: "00000000-0000-4000-8000-000000000003", status: "active", roles: ["Owner"] }],
};

async function enterWorkspace(page: Page): Promise<void> {
  await page.route("**/erp/auth/refresh", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(authenticatedSession) }));
  await page.addInitScript((session) => {
    localStorage.setItem("benchmark-erp.session", JSON.stringify(session));
    localStorage.setItem("benchmark-erp.membership", session.memberships[0]!.id);
  }, authenticatedSession);
  await page.goto("/app");
}

test("the scaffold remains readable at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".auth-card")).toBeInViewport();
});

test("the scaffold remains readable at tablet width", async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1112 });
  await page.goto("/login");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".auth-card")).toBeInViewport();
});

test("the scaffold remains readable at desktop width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/login");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator(".auth-card")).toBeInViewport();
});

test("authenticated screen shells remain reachable", async ({ page }) => {
  await enterWorkspace(page);
  const screens = [
    "/app",
    "/app/finance/accounts",
    "/app/finance/journals",
    "/app/finance/reports",
    "/app/operations",
    "/app/people",
    "/app/controls",
    "/app/planning",
    "/app/settings",
  ] as const;
  for (const path of screens) {
    await page.goto(path);
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  }
});
