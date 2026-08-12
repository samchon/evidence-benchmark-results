/**
 * Central exclusions for DTO type and property evidence claims.
 *
 * Keep real ownership evidence on the DTO declaration that represents it.
 * Add only settled non-applicability decisions here, for example:
 * `@evidenceExclude prisma:example_models.internal_note The provider keeps this operator-only value server-side; reject this exclusion if a request or response carries it.`
 */
/**
 * @evidenceExclude prisma:reddit_user_sessions Session credentials and revocation state remain server-side; reject this exclusion if a public DTO exposes them.
 * @evidenceExcludeReview prisma:reddit_user_sessions Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_recovery_proofs Recovery hashes and proof state remain server-side; reject this exclusion if a public DTO exposes them.
 * @evidenceExcludeReview prisma:reddit_recovery_proofs Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_effects External delivery payloads remain server-side; reject this exclusion if a public DTO exposes them.
 * @evidenceExcludeReview prisma:reddit_effects Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Keyboard, labeling, focus, validation, and non-color semantics belong to the frontend presentation layer; reject this exclusion if the API contract must carry them.
 * @evidenceExcludeReview docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Read the cited accessibility requirement and confirmed frontend presentation code owns keyboard, focus, labeling, and visual semantics; no DTO publishes them.
 * @evidenceExclude prisma:reddit_bans.active Ban activity is used by private moderation state but is not part of the public ban projection; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_bans.active Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_bans.community_id Ban community scope is resolved by the moderation route and remains out of the ban projection; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_bans.community_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_bans.created_at Ban audit creation time is server-side metadata; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_bans.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_bans.ended_at Ban revocation metadata is server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_bans.ended_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_comments.deleted_at Deletion audit time remains server-side while the DTO exposes only the neutral marker; reject if the DTO exposes the timestamp.
 * @evidenceExcludeReview prisma:reddit_comments.deleted_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_comments.parent_id Reply linkage is represented by recursive response nesting and route context, not a public scalar; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_comments.parent_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_comments.post_id Post scope is carried by the route and enclosing response, not a public comment scalar; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_comments.post_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_comments.updated_at Edit audit time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_comments.updated_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_communities.created_at Community audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_communities.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_communities.name_normalized Case-folded lookup state remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_communities.name_normalized Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_communities.updated_at Community audit update time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_communities.updated_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderation_actions.community_id Community scope is carried by the moderation route; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderation_actions.community_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderation_actions.created_at History audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderation_actions.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderation_actions.target_description Private moderation correlation text remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderation_actions.target_description Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderation_actions.target_id Private target correlation identity remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderation_actions.target_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderator_assignments.community_id Assignment scope is carried by the moderation route; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderator_assignments.community_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderator_assignments.created_at Assignment audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderator_assignments.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_moderator_assignments.revoked_at Revocation audit time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_moderator_assignments.revoked_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_posts.deleted_at Deletion audit time remains server-side while public reads expose availability; reject if the DTO exposes the timestamp.
 * @evidenceExcludeReview prisma:reddit_posts.deleted_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_posts.updated_at Edit audit time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_posts.updated_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_profiles.avatar_thumbnail Thumbnail derivation is an internal media optimization; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_profiles.avatar_thumbnail Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_profiles.created_at Profile audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_profiles.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_profiles.updated_at Profile audit update time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_profiles.updated_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_reports.community_id Report scope is carried by the moderation route; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_reports.community_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_reports.decided_at Decision audit time remains server-side in the report projection; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_reports.decided_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_reports.moderator_id Acting moderator identity remains private moderation metadata; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_reports.moderator_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_subscriptions.created_at Subscription audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_subscriptions.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_subscriptions.ended_at Ended-subscription audit time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_subscriptions.ended_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_subscriptions.user_id The current authenticated user is route context rather than a public subscription field; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_subscriptions.user_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.created_at Account audit creation time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.created_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.deleted_at Account deletion state is represented by public de-identification, not a raw timestamp; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.deleted_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.email_normalized Case-folded uniqueness state remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.email_normalized Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.password_hash Credential material never crosses the DTO boundary; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.password_hash Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.updated_at Account audit update time remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.updated_at Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_users.username_normalized Case-folded uniqueness state remains server-side; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_users.username_normalized Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_votes.comment_id Vote target linkage is represented by the vote route; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_votes.comment_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_votes.post_id Vote target linkage is represented by the vote route; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_votes.post_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 * @evidenceExclude prisma:reddit_votes.user_id The authenticated voter is route context rather than a public vote field; reject if the DTO exposes it.
 * @evidenceExcludeReview prisma:reddit_votes.user_id Read all DTOs and the RedditProvider boundary and confirmed this persisted field remains server-side or route context; no public DTO publishes it.
 */
export const DTO_EVIDENCE_EXCLUDE = true;
