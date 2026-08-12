import { expect, test, type Page } from "@playwright/test";

const icon = {
  name: "icon.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64",
  ),
};

export async function journey_account_to_discussion(page: Page): Promise<{ postUrl: string; commentText: string }> {
  const stamp = Date.now().toString();
  const username = `journey${stamp.slice(-10)}`;
  const email = `${username}@example.test`;
  const password = "journey-password-123";
  const communityName = `journey-${stamp.slice(-8)}`;
  const postTitle = `A persisted post ${stamp}`;
  const commentText = `A persisted comment ${stamp}`;

  await page.goto("/auth");
  await page.getByRole("tab", { name: "Create account" }).click();
  await page.locator("#email").fill(email);
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator("form").getByRole("button", { name: "Create account", exact: true }).click();
  await page.getByRole("link", { name: username }).waitFor();

  await page.goto("/communities");
  await page.getByRole("button", { name: "Create a community" }).click();
  await page.locator("#name").fill(communityName);
  await page.locator("#description").fill(
    "A community created by the live browser journey.",
  );
  await page.locator('input[type="file"]').setInputFiles(icon);
  await page.getByRole("button", { name: "Create community", exact: true }).click();
  await page.getByRole("heading", { name: communityName }).waitFor();
  const communityId = new URL(page.url()).pathname.split("/").at(-1) ?? "";

  await page.goto("/");
  await page.getByRole("button", { name: "Create a post" }).click();
  await page.locator("#community-id").fill(communityId);
  await page.locator("#post-title").fill(postTitle);
  await page.locator("#post-text").fill(
    "A text payload persisted by the browser journey.",
  );
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.getByRole("link", { name: postTitle }).waitFor();
  await page.getByRole("link", { name: postTitle }).click();
  const postUrl = page.url();

  await page.getByRole("button", { name: "Upvote" }).first().click();
  await page.locator(".score-box strong").waitFor();
  await page.locator("#comment").fill(commentText);
  await page.getByRole("button", { name: "Comment", exact: true }).click();
  await page.getByText(commentText).waitFor();
  await page.locator(".comment-body").getByRole("button", { name: "Edit", exact: true }).click();
  await page.locator(".comment-body textarea").fill(`${commentText} edited`);
  await page.locator(".comment-body").getByRole("button", { name: "Save", exact: true }).click();
  await page.getByText(`${commentText} edited`).waitFor();
  await page.getByRole("button", { name: "Report", exact: true }).click();
  await page.getByLabel("Report reason").fill(
    "The live journey is exercising comment report delivery.",
  );
  await page.getByRole("button", { name: "Report comment", exact: true }).click();
  await page.getByText("Comment report submitted").waitFor();
  await page.locator("#reason").fill(
    "The live journey is exercising report delivery.",
  );
  await page.getByRole("button", { name: "Submit report", exact: true }).click();
  await page.getByText("Report submitted to scoped moderators").waitFor();

  await page.goto(`/community/${communityId}`);
  await page.getByRole("heading", { name: communityName }).waitFor();
  await page.getByRole("tab", { name: "Moderation tools", exact: true }).click();
  await page.getByRole("heading", { name: "Unresolved reports" }).waitFor();
  await page.getByRole("button", { name: "Dismiss", exact: true }).first().click();
  await page.getByRole("button", { name: "Dismiss", exact: true }).first().waitFor();
  await page.getByRole("button", { name: "Dismiss", exact: true }).first().click();
  await page.getByText("No unresolved reports.", { exact: true }).waitFor();

  await page.goto("/");
  await page.getByRole("button", { name: "Create a post" }).click();
  await page.locator("#community-id").fill(communityId);
  await page.locator("#post-title").fill(`A link post ${stamp}`);
  await page.getByLabel("Post type").selectOption("link");
  await page.locator("#post-url").fill("https://example.com/journey");
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.getByRole("link", { name: `A link post ${stamp}` }).waitFor();
  await page.getByRole("link", { name: `A link post ${stamp}` }).click();
  await page.getByRole("button", { name: "https://example.com/journey", exact: true }).waitFor();
  await page.goto("/");

  await page.getByRole("button", { name: "Create a post" }).click();
  await page.locator("#community-id").fill(communityId);
  await page.locator("#post-title").fill(`An image post ${stamp}`);
  await page.getByLabel("Post type").selectOption("image");
  await page.locator('input[type="file"]').setInputFiles(icon);
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.getByRole("link", { name: `An image post ${stamp}` }).waitFor();
  await page.getByRole("link", { name: `An image post ${stamp}` }).click();
  await page.getByAltText(`Image for An image post ${stamp}`).waitFor();
  await page.goto("/");
  await page.getByAltText(`Thumbnail for An image post ${stamp}`).waitFor();

  await page.getByRole("banner").getByRole("link", { name: username, exact: true }).click();
  await page.getByRole("heading", { name: "Authored posts" }).waitFor();
  await page.getByRole("link", { name: "Settings" }).click();
  await page.getByRole("heading", { name: "Settings" }).waitFor();
  return { postUrl, commentText };
}

test("a live account can publish and discuss", async ({ page }) => {
  const result = await journey_account_to_discussion(page);
  await page.goto(result.postUrl);
  await expect(page.locator(".score-box strong")).toHaveText("1");
  await expect(page.getByText(result.commentText)).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByRole("banner").getByRole("link", { name: "Sign in", exact: true }).waitFor();
  await page.goto(result.postUrl);
  await expect(page.getByRole("button", { name: "Upvote", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign in to vote", exact: true })).toHaveCount(2);
});
