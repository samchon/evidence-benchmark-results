import * as api from "@benchmark/reddit2-api";
import crypto from "node:crypto";
import typia from "typia";

/**
 * Proves a registered user can create a discoverable community.
 *
 * 1. Register a unique owner.
 * 2. Create a community through the primary operation.
 * 3. Read it back by id and assert its owner bootstrap state.
 *
 * @evidence {@link api.functional.community.create.communityCreate} Exercises the generated operation accessor.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-001-bootstrap-community-owner-and-subscriber The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-role-community-scoped-authority The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-002-relate-a-community-to-its-owner The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-003-relate-communities-to-subscribers The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-001-create-a-community The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules The test exercises the communityCreate operation against this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-002-keep-subscription-count-and-home-feed-mutually-consistent The test exercises the communityCreate operation against this requirement.
 */
export async function test_api_community_create(connection: api.IConnection): Promise<void> {
  const owner: api.IConnection = { host: connection.host };
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  const user = await api.functional.auth.user.join.execute.join(owner, {
    email: `community-${suffix}@example.com`,
    username: `owner_${suffix}`,
    password: "Password123!",
  });
  typia.assert(user);
  const created = await api.functional.community.create.communityCreate(owner, {
    name: `Community ${suffix}`,
    description: "A community created by the backend feature suite.",
    iconUrl: null,
  });
  typia.assert(created);
  const detail = await api.functional.community.detail.communityAt(owner, created.id);
  typia.assert(detail);
  if (detail.id !== created.id || detail.subscriberCount !== 1) throw new Error("Community creation did not bootstrap its owner subscription.");
}
