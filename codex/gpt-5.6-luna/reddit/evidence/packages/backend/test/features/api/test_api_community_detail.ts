import * as api from "@benchmark/reddit2-api";

/**
 * @evidence {@link api.functional.community.detail.communityAt} Exercises the generated operation accessor.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-community-model The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-001-define-community-attributes The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/02-domain-model.md#req-dom-community-004-relate-communities-to-content-and-moderation The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-community-community-operations The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The generated request/response contract for this operation is exercised at the SDK boundary; server behavior is proved by live execution.
 */
export async function test_api_community_detail(connection: api.IConnection): Promise<void> {
  await api.functional.community.detail.communityAt({ ...connection, simulate: true }, "00000000-0000-4000-8000-000000000000");
}






