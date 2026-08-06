/**
 * Central exclusions for frontend journey evidence claims.
 *
 * This journey proves route reachability and visible controls. Persisted
 * lifecycle and invariant claims remain owned by the API/backend until a
 * deterministic stateful fixture is added here.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-community-life-community-ownership-lifecycle Ownership transfer and archival state transitions are backend lifecycle outcomes, not exercised by this route-reachability journey; reject if a seeded ownership scenario is added.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-ban-community-ban-lifecycle Ban state transitions and history are persisted by the API/backend; reject this exclusion when a seeded moderation lifecycle scenario is added.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-comment-comment-model Comment identity, nesting, and display data are API-owned; reject this exclusion when a seeded comment tree is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Comment edit/delete lifecycle is API-owned; reject this exclusion when a seeded edit and reply-preservation scenario is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-community-community-model Community ownership, subscribers, content, and moderation relationships are API-owned; reject this exclusion when a seeded community fixture is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-karma-karma-model Karma contribution mapping and the signed total are API-owned; reject this exclusion when a seeded vote/profile scenario is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-post-post-model Post identity, payload, participation, and feed presentation data are API-owned; reject this exclusion when a seeded post fixture is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Post edit/delete lifecycle and dependent participation are API-owned; reject this exclusion when a seeded mutation scenario is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Public profile attributes and authored-content relationships are API-owned; reject this exclusion when a seeded profile fixture is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-report-content-report-model Report target, reporter, reason, and queue relationships are API-owned; reject this exclusion when a seeded moderation fixture is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-report-life-content-report-lifecycle Report resolution lifecycle is API-owned; reject this exclusion when seeded approve/dismiss scenarios are exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-subscription-subscription-lifecycle Subscription state transitions are API-owned; reject this exclusion when a seeded subscribe/unsubscribe scenario is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-vote-vote-model Vote identity, target, score, and karma relationships are API-owned; reject this exclusion when a seeded vote scenario is exercised.
 * @evidenceExclude docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Vote direction changes and removal are API-owned; reject this exclusion when a seeded vote lifecycle scenario is exercised.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Comment validation, depth, and ordering are API-owned; reject this exclusion when the journey adds a deterministic comment tree.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-community-community-validation-and-discovery-rules Community creation/search validation is API-owned; reject this exclusion when the journey adds deterministic results and rejection assertions.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-feed-feed-ranking-and-pagination-rules Feed ranking and pagination are API-owned; reject this exclusion when seeded feeds and page boundaries are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-identity-account-identity-rules Identity uniqueness and registration refusal are API-owned; reject this exclusion when deterministic conflict fixtures are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Media validation and rendering are API-owned; reject this exclusion when a multipart/media fixture is asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-moderation-moderation-authority-rules Moderation authority and owner protection are API-owned; reject this exclusion when a seeded moderator fixture is asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-pagination-shared-pagination-rules Page-size and continuation validation are API-owned; reject this exclusion when deterministic page cursors are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-participation-community-participation-rules Subscription, ban, and viewing participation rules are API-owned; reject this exclusion when seeded roles are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Post payload and edit restrictions are API-owned; reject this exclusion when deterministic post mutations are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Profile field validation is API-owned; reject this exclusion when deterministic invalid edits are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Report targets, duplicates, visibility, and resolution are API-owned; reject this exclusion when seeded reports are asserted.
 * @evidenceExclude docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Vote uniqueness and aggregate adjustments are API-owned; reject this exclusion when seeded votes are asserted.
 * @evidenceExclude docs/analysis/05-non-functional.md#req-nfr-integrity-visible-aggregate-integrity Cross-view aggregate consistency is owned by API behavior and query invalidation; reject this exclusion when a seeded mutation journey asserts the resulting views.
 */
export const JOURNEY_EVIDENCE_EXCLUDE = true;
