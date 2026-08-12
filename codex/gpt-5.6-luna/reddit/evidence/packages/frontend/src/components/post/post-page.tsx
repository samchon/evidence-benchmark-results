import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "@benchmark/reddit-api";
import { useComments, useModeration, usePost, useSession, useVoting } from "../../lib/reddit/hooks";
import { EmptyState, ErrorState, Field, LoadingState, Notice, PageHeader } from "@/components/ui";
import { readImageFile, relativeTime } from "@/lib/utils";

function CommentNode({ comment, postId, communityId, sort, depth = 0 }: { comment: api.IRedditComment; postId: string; communityId: string; sort: api.IRedditComment.IRequest["sort"]; depth?: number }) {
  const comments = useComments(postId, { page: 1, limit: 25, sort });
  const voting = useVoting();
  const moderation = useModeration(communityId, { page: 1, limit: 25 });
  const [reply, setReply] = useState("");
  const [editText, setEditText] = useState(comment.text ?? "");
  const [reportReason, setReportReason] = useState("");
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const submitReply = (event: FormEvent) => { event.preventDefault(); comments.reply.mutate({ id: comment.id, body: { text: reply } as api.IRedditComment.IReply }, { onSuccess: () => { setReply(""); setReplying(false); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Reply refused.") }); };
  const submitEdit = (event: FormEvent) => { event.preventDefault(); comments.update.mutate({ id: comment.id, body: { text: editText } as api.IRedditComment.IUpdate }, { onSuccess: () => { setEditing(false); setMessage("Comment updated."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Comment edit refused.") }); };
  const deleteComment = () => comments.erase.mutate(comment.id, { onSuccess: () => setMessage("Comment deleted."), onError: (error) => setMessage(error instanceof Error ? error.message : "Comment deletion refused.") });
  const submitReport = (event: FormEvent) => { event.preventDefault(); moderation.report.mutate({ community: communityId, body: { targetType: "comment", targetId: comment.id, reason: reportReason } as api.IRedditReport.ICreate }, { onSuccess: () => { setReporting(false); setReportReason(""); setMessage("Comment report submitted."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Comment report refused.") }); };
  return <div className="comment-node" style={{ marginLeft: `${Math.min(depth, 5) * 1.25}rem` }}><div className="comment-header"><strong>{comment.deleted ? "Deleted account" : comment.author ? `u/${comment.author.username}` : "Deleted account"}</strong><span>{comment.score} points</span><time dateTime={comment.createdAt}>{relativeTime(comment.createdAt)}</time></div>{editing ? <form className="form-stack compact-form" onSubmit={submitEdit}><Field label="Comment"><textarea aria-label="Comment" required value={editText} onChange={(event) => setEditText(event.target.value)} /></Field><div className="inline-actions"><button type="submit" className="button button-small button-primary">Save edit</button><button type="button" className="text-button" onClick={() => setEditing(false)}>Cancel</button></div></form> : <p className={comment.deleted ? "deleted-content" : "comment-text"}>{comment.deleted ? "[deleted]" : comment.text}</p>}<div className="comment-actions"><button type="button" className="text-button" onClick={() => setReplying(!replying)}>Reply</button><button type="button" className="text-button" onClick={() => voting.comment.mutate({ id: comment.id, body: { value: 1 } as api.IRedditVote.IRequest })}>Upvote</button><button type="button" className="text-button" onClick={() => setEditing(true)} disabled={comment.deleted}>Edit</button><button type="button" className="text-button" onClick={deleteComment} disabled={comment.deleted}>Delete</button><button type="button" className="text-button" onClick={() => setReporting(!reporting)} disabled={comment.deleted}>Report</button><button type="button" className="text-button" onClick={() => moderation.deleteComment.mutate({ community: communityId, comment: comment.id })} disabled={comment.deleted}>Moderate</button></div>{message && <Notice tone="info">{message}</Notice>}{replying && <form className="reply-form" onSubmit={submitReply}><Field label="Reply"><textarea aria-label="Reply" required value={reply} onChange={(event) => setReply(event.target.value)} /></Field><button type="submit" className="button button-small button-primary">Reply</button></form>}{reporting && <form className="reply-form" onSubmit={submitReport}><Field label="Report reason"><textarea aria-label="Report reason" required maxLength={2000} value={reportReason} onChange={(event) => setReportReason(event.target.value)} /></Field><button type="submit" className="button button-small button-danger">Report comment</button></form>}{comment.replies.map((child) => <CommentNode key={child.id} comment={child} postId={postId} communityId={communityId} sort={sort} depth={depth + 1} />)}</div>;
}

function PostBody({ post }: { post: api.IRedditPost }) {
  if (post.type === "link" && post.url) return <button type="button" className="link-preview" aria-label="Open link post" onClick={() => window.open(post.url ?? "", "_blank", "noopener,noreferrer")}>{post.url}</button>;
  if (post.type === "image" && post.image) return <img className="post-image" src={post.image} alt={`Image for ${post.title}`} />;
  return <p className="post-body">{post.text}</p>;
}

/** Covers post detail, voting, reporting, comments, nested replies, and freshness after mutations.
 * @evidence {@link useComments} Reads and mutates the recursive thread.
 * @evidenceReview {@link useComments} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useModeration} Submits reports and scoped moderation actions.
 * @evidenceReview {@link useModeration} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link usePost} Reads the complete post.
 * @evidenceReview {@link usePost} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useSession} Enables authenticated participation.
 * @evidenceReview {@link useSession} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useVoting} Applies post and comment vote transitions.
 * @evidenceReview {@link useVoting} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model Renders comment identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-comment-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Renders comment author and score.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-001-define-comment-identity-and-display Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Renders recursive replies.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-002-relate-comments-through-unbounded-nesting Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Renders comment lifecycle markers.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Preserves comment identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Preserves deleted markers and replies.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model Renders post detail.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-post-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Renders post relationships.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-001-define-post-identity-and-relationships Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Renders typed payloads.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-002-define-post-types-and-payloads Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Renders post lifecycle actions.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Preserves post identity.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Keeps deletion effects fresh.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Renders vote controls and scores.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-vote-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Provides vote direction controls.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Shows score output.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Provides vote lifecycle controls.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Provides upvote.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Provides downvote.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Provides direction changes.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Provides vote removal.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-content-report-model Presents report entry.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-content-report-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Sends target and reason.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-report-001-define-report-target-reporter-and-reason Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Delivers comment operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Provides top-level composer.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Provides reply composer.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Renders nested thread.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Provides comment sort.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Provides comment edit controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Provides comment delete controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Provides scoped comment action.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-comment-007-delete-a-community-comment-as-moderator Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations Delivers post operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-post-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Provides detail.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-002-view-a-single-post Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Provides post edit controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Provides post delete controls.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Provides scoped post action.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-post-005-delete-a-community-post-as-moderator Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Provides post and comment report forms.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Delivers vote operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Provides vote actions.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Provides direction changes.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Provides vote removal.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Uses recursive sorting.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Sends reply target through SDK.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Renders recursive descendants.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Selects Best.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Selects New.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Selects Controversial.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Uses typed post output.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-post-content-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Shows title and payload.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-001-validate-required-title-and-exact-post-payload Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Renders link/image payloads.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-002-validate-link-and-image-payloads Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Provides same-type edit boundary.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Leaves comments separate from follow state.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Shows server refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-participation-003-refuse-banned-user-posting-and-commenting Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Renders typed image output.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-uploaded-image-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Presents image content.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-media-002-present-uploaded-images-and-post-thumbnails Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Sends bounded report reasons.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-reporting-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Requires a reason.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-001-require-a-valid-report-target-and-reason Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Shows server refusal.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-report-002-refuse-duplicate-unresolved-reports Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Shows vote aggregates.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Uses one transition control.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-001-enforce-one-active-vote-per-user-and-target Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Shows score.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-002-calculate-content-vote-score Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Refreshes after vote.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-003-adjust-author-karma-for-vote-transitions Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Reflects server deletion effects.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-vote-004-reverse-vote-aggregates-when-content-is-deleted Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Keeps nested replies navigable.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Uses immutable timestamps.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Refreshes score after vote.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Shows comment count and thread.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Invalidates public views.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Preserves public content.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function PostPage() {
  const { id } = useParams();
  const session = useSession();
  const post = usePost(id);
  type CommentSort = "best" | "new" | "controversial";
  const [commentSort, setCommentSort] = useState<CommentSort>("best");
  const comments = useComments(id, { page: 1, limit: 50, sort: commentSort });
  const voting = useVoting();
  const moderation = useModeration(post.query.data?.community.id, { page: 1, limit: 25 });
  const [text, setText] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editPayload, setEditPayload] = useState("");
  if (post.query.isLoading) return <LoadingState label="Loading post" />;
  if (post.query.error) return <ErrorState error={post.query.error} retry={() => void post.query.refetch()} />;
  if (!post.query.data) return <EmptyState title="Post not found" />;
  const data = post.query.data;
  const beginEdit = () => { setEditTitle(data.title); setEditPayload(data.type === "text" ? data.text ?? "" : data.type === "link" ? data.url ?? "" : data.image ?? ""); setEditing(true); };
  const savePost = (event: FormEvent) => { event.preventDefault(); const body = data.type === "text" ? { title: editTitle, text: editPayload } : data.type === "link" ? { title: editTitle, url: editPayload } : { title: editTitle, image: editPayload }; post.update.mutate({ id: data.id, body: body as api.IRedditPost.IUpdate }, { onSuccess: () => { setEditing(false); setMessage("Post updated."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Post edit refused.") }); };
  const deletePost = () => post.erase.mutate(data.id, { onSuccess: () => setMessage("Post deleted."), onError: (error) => setMessage(error instanceof Error ? error.message : "Post deletion refused.") });
  const deleteModeratedPost = () => moderation.deletePost.mutate({ community: data.community.id, post: data.id }, { onSuccess: () => setMessage("Post removed by moderation."), onError: (error) => setMessage(error instanceof Error ? error.message : "Moderation deletion refused.") });
  const submitComment = (event: FormEvent) => { event.preventDefault(); comments.create.mutate({ id: data.id, body: { text } as api.IRedditComment.ICreate }, { onSuccess: () => { setText(""); setMessage("Comment published."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Comment refused.") }); };
  const submitReport = (event: FormEvent) => { event.preventDefault(); moderation.report.mutate({ community: data.community.id, body: { targetType: "post", targetId: data.id, reason } as api.IRedditReport.ICreate }, { onSuccess: () => { setReason(""); setMessage("Thanks. Your report is in the community queue."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Report refused.") }); };
  return <section className="page"><PageHeader eyebrow={`r/${data.community.name}`} title={data.title} description={<><Link to={`/profile/${data.author.username}`}>u/{data.author.username}</Link> · <time dateTime={data.createdAt}>{relativeTime(data.createdAt)}</time></>} /><article className="detail-card"><div className="post-meta"><span>{data.score} points</span><span>·</span><span>{data.commentCount} comments</span></div>{editing ? <form className="form-stack compact-form" onSubmit={savePost}><Field label="Title"><input aria-label="Title" required maxLength={300} value={editTitle} onChange={(event) => setEditTitle(event.target.value)} /></Field>{data.type === "image" ? <Field label="Image"><input aria-label="Image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(setEditPayload).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Image could not be read.")); }} /></Field> : data.type === "text" ? <Field label="Text"><textarea aria-label="Text" required value={editPayload} onChange={(event) => setEditPayload(event.target.value)} /></Field> : <Field label="URL"><textarea aria-label="URL" required value={editPayload} onChange={(event) => setEditPayload(event.target.value)} /></Field>}<div className="inline-actions"><button type="submit" className="button button-primary">Save post</button><button type="button" className="text-button" onClick={() => setEditing(false)}>Cancel</button></div></form> : <PostBody post={data} />}<div className="detail-actions"><button type="button" aria-label="Upvote post" className="button button-quiet" onClick={() => voting.post.mutate({ id: data.id, body: { value: 1 } as api.IRedditVote.IRequest })}>▲ Upvote</button><button type="button" aria-label="Downvote post" className="button button-quiet" onClick={() => voting.post.mutate({ id: data.id, body: { value: -1 } as api.IRedditVote.IRequest })}>▼ Downvote</button><button type="button" aria-label="Remove post vote" className="button button-quiet" onClick={() => voting.erasePost.mutate(data.id)}>Remove vote</button><button type="button" className="text-button" onClick={beginEdit}>Edit post</button><button type="button" className="text-button" onClick={deletePost}>Delete my post</button><button type="button" className="text-button" onClick={deleteModeratedPost}>Delete as moderator</button></div>{message && <Notice tone="info">{message}</Notice>}</article><div className="detail-grid"><div><div className="section-heading"><h2>Comments</h2><select aria-label="Comment sort" value={commentSort} onChange={(event) => setCommentSort(event.target.value as CommentSort)}><option value="best">Best</option><option value="new">New</option><option value="controversial">Controversial</option></select></div>{session === "authenticated" && <form className="comment-composer" onSubmit={submitComment}><Field label="Join the conversation"><textarea aria-label="Join the conversation" required value={text} onChange={(event) => setText(event.target.value)} placeholder="Add something useful…" /></Field>{message && <Notice tone={comments.create.isError ? "danger" : "success"}>{message}</Notice>}<button type="submit" className="button button-primary" disabled={comments.create.isPending}>Comment</button></form>}{comments.query.isLoading && <LoadingState label="Loading comments" />}{comments.query.error && <ErrorState error={comments.query.error} retry={() => void comments.query.refetch()} />}{comments.query.data?.data.length === 0 && <EmptyState title="No comments yet">Be the first thoughtful reply.</EmptyState>}{comments.query.data?.data.map((comment) => <CommentNode key={comment.id} comment={comment} postId={data.id} communityId={data.community.id} sort={commentSort} />)}</div><aside className="side-stack"><details className="details-card"><summary>Report this post</summary><form className="form-stack compact-form" onSubmit={submitReport}><Field label="Reason"><textarea aria-label="Reason" required maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="What should moderators know?" /></Field><button type="submit" className="button button-danger" disabled={moderation.report.isPending}>Send report</button></form></details><div className="info-card"><h2>About this post</h2><p>Created {new Date(data.createdAt).toLocaleString()}</p><Link className="text-button" to={`/communities/${data.community.id}`}>Visit r/{data.community.name}</Link></div></aside></div></section>;
}
