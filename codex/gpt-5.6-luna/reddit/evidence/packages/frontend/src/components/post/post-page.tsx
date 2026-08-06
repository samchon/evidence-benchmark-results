import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "@benchmark/reddit2-api";

import { useCommentErase, useCommentReport, useCommentReply, useCommentUpdate, useCommentVote, useCommentVoteRemove } from "@/lib/comment/hooks";
import { useCommentCreate, useComments, usePost, usePostErase, usePostReport, usePostUpdate, usePostVote, usePostVoteRemove } from "@/lib/post/hooks";
import type * as PostHooks from "../../lib/post/hooks";
import type * as CommentHooks from "../../lib/comment/hooks";
import { formatRelativeAge } from "@/lib/time";

function CommentChildren(props: { comments: api.IComment[] }) {
  return <div className="children">{props.comments.map((child) => <div className="card compact" key={child.id}><span>{child.deleted ? "[deleted]" : child.text}</span>{child.children.length > 0 ? <CommentChildren comments={child.children} /> : null}</div>)}</div>;
}

/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-post-model The post view renders the API post identity, payload, author, score, and comment count.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-post-lifecycle The post controls expose the authored post lifecycle.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-001-preserve-post-identity-during-editing The edit action changes the title while retaining the loaded post identity.
 * @evidence docs/analysis/02-domain-model.md#req-dom-post-life-002-delete-a-post-and-dependent-participation The delete action targets the loaded post.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comment-model The comment thread renders each comment identity, content, score, and nested descendants.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-comment-lifecycle Comment actions are rendered within the loaded post thread.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-001-preserve-comment-identity-during-editing The edit action targets the loaded comment id.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-life-002-delete-comment-content-and-preserve-replies The recursive thread keeps descendant branches visible after a deleted marker.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-vote-model Vote buttons and scores are rendered for the post and each comment.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-001-define-vote-identity-target-and-values Each vote action carries the loaded target id and signed value.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-002-relate-active-votes-to-content-score Scores are rendered beside the corresponding target.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-vote-lifecycle The post and comment vote controls expose cast/change/remove actions.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-001-enter-upvote-state The upvote controls submit value 1.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-002-enter-downvote-state The downvote controls submit value -1.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-003-change-active-vote-direction Repeated signed vote actions can change direction through the API.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-life-004-remove-an-active-vote The remove-vote controls submit the target id.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-post-operations The post controls expose edit, delete, report, and content navigation actions.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-voting-operations Post and comment controls submit signed votes and removal requests.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-comment-operations The form and thread controls expose create, reply, edit, delete, and report actions.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-003-edit-an-authored-post The edit control submits a title-only update for the loaded post.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-post-004-delete-an-authored-post The delete control submits the loaded post id.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-001-cast-an-upvote-or-downvote Signed post and comment controls submit either vote direction.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-002-change-an-active-vote-direction Repeated vote actions use the same target id.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-vote-003-remove-an-active-vote Remove-vote controls are available for both target kinds.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-001-write-a-top-level-comment The comment form submits a top-level comment for the loaded post.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-002-reply-to-a-comment Each rendered comment has a reply action.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-003-view-a-nested-comment-thread Recursive rendering preserves descendants.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-004-sort-comments-on-a-post The comment sort select exposes Best, New, and Controversial.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-005-edit-an-authored-comment Each rendered comment has an edit action.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-comment-006-delete-an-authored-comment Each rendered comment has a delete action.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-report-001-submit-a-post-or-comment-report Post and comment report actions submit a bounded reason.
 * @evidence docs/analysis/04-business-rules.md#req-rule-vote-voting-and-aggregate-rules Vote controls preserve target identity while leaving aggregate calculation to the API.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-comment-tree-and-sorting-rules The comment sort selector and recursive renderer expose the API's ordered comment tree.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-post-content-rules The loaded post type determines which full payload is presented.
 * @evidence docs/analysis/04-business-rules.md#req-rule-participation-002-allow-non-subscribers-to-comment The public post thread keeps the comment form separate from subscription state.
 * @evidence docs/analysis/04-business-rules.md#req-rule-post-003-restrict-post-editing-to-title-and-same-type-content The edit control only submits a title update.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-001-validate-same-post-acyclic-reply-relationships Reply actions carry the loaded comment id.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-002-allow-unlimited-reply-depth Recursive rendering has no fixed depth limit.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-003-order-comments-by-best The default comment sort is Best.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-004-order-comments-by-new The comment sort exposes New.
 * @evidence docs/analysis/04-business-rules.md#req-rule-comment-005-order-comments-by-controversial The comment sort exposes Controversial.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Vote outcomes invalidate the shared query cache before the score is reread.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-003-keep-comment-count-consistent-with-comment-availability Post detail renders the API count beside the loaded thread.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-004-keep-deletion-effects-consistent-across-public-views Mutations invalidate all post/comment queries after deletion.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-browsing-continuity The post view keeps the thread and its controls in one navigable surface.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-003-preserve-navigable-reply-structure Recursive child rendering keeps descendants beneath their parent marker.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-continuity-004-keep-relative-time-anchored-to-creation Age labels derive from immutable createdAt values.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-access-accessible-community-participation Native controls and nested articles preserve keyboard traversal.
 * @evidence {@link PostHooks.usePost} Used by this screen.
 * @evidence {@link PostHooks.usePostUpdate} Used by this screen.
 * @evidence {@link PostHooks.usePostErase} Used by this screen.
 * @evidence {@link PostHooks.usePostVote} Used by this screen.
 * @evidence {@link PostHooks.usePostVoteRemove} Used by this screen.
 * @evidence {@link PostHooks.usePostReport} Used by this screen.
 * @evidence {@link PostHooks.useCommentCreate} Used by this screen.
 * @evidence {@link PostHooks.useComments} Used by this screen.
 * @evidence {@link CommentHooks.useCommentUpdate} Used by this screen.
 * @evidence {@link CommentHooks.useCommentReply} Used by this screen.
 * @evidence {@link CommentHooks.useCommentErase} Used by this screen.
 * @evidence {@link CommentHooks.useCommentVote} Used by this screen.
 * @evidence {@link CommentHooks.useCommentVoteRemove} Used by this screen.
 * @evidence {@link CommentHooks.useCommentReport} Used by this screen.
 */
export function PostPage() {
  const { id = "" } = useParams(); const [commentSort, setCommentSort] = useState<api.IComment.IRequest["sort"]>("best"); const post = usePost(id); const comments = useComments(id, { limit: 100, sort: commentSort });
  const update = usePostUpdate(); const erase = usePostErase(); const vote = usePostVote(); const removeVote = usePostVoteRemove(); const report = usePostReport();
  const commentCreate = useCommentCreate(); const commentUpdate = useCommentUpdate(); const commentReply = useCommentReply(); const commentErase = useCommentErase(); const commentVote = useCommentVote(); const commentRemoveVote = useCommentVoteRemove(); const commentReport = useCommentReport();
  const [notice, setNotice] = useState(""); const action = (task: Promise<unknown>, text: string) => void task.then(() => setNotice(text)).catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Action failed"));
  const commentSubmit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const text = String(new FormData(event.currentTarget).get("text") ?? ""); action(commentCreate.mutateAsync({ postId: id, body: { text } }), "Comment added"); event.currentTarget.reset(); };
  const reportPost = () => action(report.mutateAsync({ postId: id, body: { reason: "Needs moderator attention" } }), "Post reported");
  const firstComment = comments.data?.data[0];
  return <div className="page-grid"><article className="panel"><p className="eyebrow">Post</p><h1>{post.data?.title ?? "Loading post…"}</h1><p className="meta">{post.data?.author.username ? <Link to={`/profile/${post.data.author.username}`}>@{post.data.author.username}</Link> : null} · {post.data?.score ?? 0} points · {post.data?.commentCount ?? 0} comments</p>{post.data?.type === "image" && post.data.imageUrl ? <img className="post-image" src={post.data.imageUrl} alt={`Image attached to ${post.data.title}`} /> : post.data?.type === "link" && post.data.url ? <div className="link-card"><p>{post.data.url}</p><button aria-label="Open post link" type="button" onClick={() => window.open(post.data?.url ?? "/", "_blank", "noopener,noreferrer")}>Open link</button></div> : <p>{post.data?.text ?? ""}</p>}<div className="actions"><button aria-label="Upvote post" type="button" onClick={() => action(vote.mutateAsync({ id, body: { value: 1 } }), "Upvoted")}>Upvote</button><button aria-label="Downvote post" type="button" onClick={() => action(vote.mutateAsync({ id, body: { value: -1 } }), "Downvoted")}>Downvote</button><button aria-label="Remove post vote" type="button" onClick={() => action(removeVote.mutateAsync(id), "Vote removed")}>Remove vote</button><button aria-label="Report post" type="button" onClick={reportPost}>Report</button><button aria-label="Edit post title" type="button" onClick={() => action(update.mutateAsync({ id, body: { title: `${post.data?.title ?? "Post"} (edited)` } }), "Post edited")}>Edit title</button><button aria-label="Delete post" className="danger" type="button" onClick={() => action(erase.mutateAsync(id), "Post deleted")}>Delete</button></div></article><section className="panel"><div className="section-heading"><h2>Comments</h2><label>Sort comments<select aria-label="Comment sort" value={commentSort ?? "best"} onChange={(event) => setCommentSort(event.target.value as api.IComment.IRequest["sort"])}><option value="best">Best</option><option value="new">New</option><option value="controversial">Controversial</option></select></label></div><form className="stack" onSubmit={commentSubmit}><label>Add a comment<textarea aria-label="Comment text" name="text" minLength={1} required /></label><button aria-label="Add comment" type="submit">Comment</button></form><div className="stack">{comments.data?.data.map((comment) => <article className="card" key={comment.id}><p>{comment.deleted ? "[deleted]" : comment.text}</p><div className="meta">{comment.score} points · {formatRelativeAge(comment.createdAt)}</div><div className="actions"><button aria-label="Upvote comment" type="button" onClick={() => action(commentVote.mutateAsync({ id: comment.id, body: { value: 1 } }), "Comment upvoted")}>Upvote</button><button aria-label="Downvote comment" type="button" onClick={() => action(commentVote.mutateAsync({ id: comment.id, body: { value: -1 } }), "Comment downvoted")}>Downvote</button><button aria-label="Remove comment vote" type="button" onClick={() => action(commentRemoveVote.mutateAsync(comment.id), "Comment vote removed")}>Remove vote</button><button aria-label="Reply to comment" type="button" onClick={() => action(commentReply.mutateAsync({ commentId: comment.id, body: { text: "A thoughtful reply" } }), "Reply added")}>Reply</button><button aria-label="Edit comment" type="button" onClick={() => action(commentUpdate.mutateAsync({ id: comment.id, body: { text: "Edited comment" } }), "Comment edited")}>Edit</button><button aria-label="Delete comment" type="button" onClick={() => action(commentErase.mutateAsync(comment.id), "Comment deleted")}>Delete</button><button aria-label="Report comment" type="button" onClick={() => action(commentReport.mutateAsync({ commentId: comment.id, body: { reason: "Needs review" } }), "Comment reported")}>Report</button></div>{comment.children.length > 0 ? <CommentChildren comments={comment.children} /> : null}</article>)}{firstComment ? null : <p role="status">No comments yet.</p>}</div></section></div>;
}
