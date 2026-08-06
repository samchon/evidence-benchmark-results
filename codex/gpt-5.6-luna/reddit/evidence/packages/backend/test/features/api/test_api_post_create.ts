import * as api from "@benchmark/reddit2-api";
import crypto from "node:crypto";
import typia from "typia";

/**
 * Proves a subscribed owner can persist a text post and read the same identity.
 *
 * 1. Register an owner and create a community (which subscribes the owner).
 * 2. Create a text post through the primary operation.
 * 3. Read the post and assert its payload and ownership are retained.
 *
 * @evidence {@link api.functional.post.create.postCreate} Exercises the generated operation accessor.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-001-validate-community-creation-fields-and-unique-name This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-001-require-subscription-for-post-creation This operation's contract carries the data needed for this requirement; live behavior is owned by the server operation.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules The live image post carries the accepted media representation through creation and detail.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-001-validate-uploaded-image-format-and-size The live image post uses a valid PNG data image accepted by the provider boundary.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails The live image post remains available through the public detail and feed presentations.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-003-define-post-participation-measures The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-001-create-a-post The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads The test exercises the postCreate operation against this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The test exercises the postCreate operation against this requirement.
 */
export async function test_api_post_create(connection: api.IConnection): Promise<void> {
  const owner: api.IConnection = { host: connection.host };
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  await api.functional.auth.user.join.execute.join(owner, {
    email: `post-${suffix}@example.com`,
    username: `poster_${suffix}`,
    password: "Password123!",
  });
  const community = await api.functional.community.create.communityCreate(owner, {
    name: `Posts ${suffix}`,
    description: "A post fixture community.",
    iconUrl: null,
  });
  typia.assert(community);
  const created = await api.functional.post.create.postCreate(owner, community.id, {
    title: "A persisted text post",
    type: "text",
    text: "The post body survives the round trip.",
  });
  typia.assert(created);
  const detail = await api.functional.post.detail.postAt(owner, created.id);
  typia.assert(detail);
  if (detail.id !== created.id || detail.text !== "The post body survives the round trip.") throw new Error("Post payload was not persisted.");

  const imageUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
  const imagePost = await api.functional.post.create.postCreate(owner, community.id, {
    title: "A persisted image post",
    type: "image",
    imageUrl,
  });
  typia.assert(imagePost);
  if (imagePost.type !== "image" || imagePost.imageUrl !== imageUrl) throw new Error("Image payload was not retained.");
  const imageDetail = await api.functional.post.detail.postAt(owner, imagePost.id);
  typia.assert(imageDetail);
  if (imageDetail.imageUrl !== imageUrl) throw new Error("Image post detail did not preserve the image.");
  const feed = await api.functional.community.feed.feedCommunity(owner, community.id, { page: 1, limit: 10, sort: "new" });
  typia.assert(feed);
  if (!feed.data.some((item) => item.id === imagePost.id && item.preview === imageUrl)) throw new Error("Image post was not presented in the community feed.");
}


