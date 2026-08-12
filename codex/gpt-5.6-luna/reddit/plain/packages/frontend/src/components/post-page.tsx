import { useState, type FormEvent } from "react";
import type { IComment, IPost } from "@benchmark/reddit-api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import { Button, Card, Field, PageState, Pagination } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import {
  errorMessage,
  useCommentActions,
  usePost,
  usePostActions,
  usePostComments,
  useModerationQueries,
  useReportActions,
  useVoteActions,
} from "@/lib/hooks";
import { fileToMedia } from "@/lib/media";

export function PostPage(props: { postId: string }) {
  const post = usePost(props.postId);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get("commentSort");
  const sort: "best" | "new" | "controversial" = sortValue === "new" || sortValue === "controversial"
    ? sortValue
    : "best";
  const commentPageValue = Number(searchParams.get("commentPage") ?? "1");
  const commentPage = Number.isInteger(commentPageValue) && commentPageValue > 0
    ? commentPageValue
    : 1;
  const comments = usePostComments(props.postId, {
    sort,
    page: commentPage,
    limit: 25,
  });
  const { session } = useSession();
  const postActions = usePostActions();
  const commentActions = useCommentActions();
  const voteActions = useVoteActions();
  const reportActions = useReportActions();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editImage, setEditImage] = useState<Awaited<ReturnType<typeof fileToMedia>> | null>(
    null,
  );
  const setCommentParam = (key: string, value: string | null): void => {
    setSearchParams((current) => {
      const nextParams = new URLSearchParams(current);
      if (value === null) nextParams.delete(key);
      else nextParams.set(key, value);
      if (key !== "commentPage") nextParams.set("commentPage", "1");
      return nextParams;
    });
  };
  if (post.isPending) return <PageState title="Loading post" message="Opening the public post and discussion." />;
  if (post.isError) return <PageState title="Post not found" error={post.error} onRetry={() => void post.refetch()} />;
  const value = post.data;
  const isAuthor = session !== null && value.author !== null && value.author.username.toLowerCase() === session.user.username.toLowerCase();
  const submitComment = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    commentActions.create.mutate(
      { postId: props.postId, text: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment added");
        },
      },
    );
  };
  const savePost = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const body: IPost.IUpdate = value.type === "text"
      ? { title: editTitle, text: editText }
      : value.type === "link"
        ? { title: editTitle, url: editUrl }
        : { title: editTitle, image: editImage ?? undefined };
    postActions.update.mutate(
      { id: value.id, body },
      { onSuccess: () => setEditing(false) },
    );
  };
  const deletePost = (mutation: typeof postActions.deleteOwn | typeof postActions.deleteModerated): void => {
    mutation.mutate(value.id, {
      onSuccess: () => {
        void navigate("/");
      },
    });
  };
  const postError = postActions.update.error ?? postActions.deleteModerated.error ?? postActions.deleteOwn.error ?? commentActions.update.error ?? commentActions.deleteModerated.error ?? commentActions.deleteOwn.error ?? voteActions.vote.error ?? voteActions.removePostVote.error ?? voteActions.removeCommentVote.error ?? reportActions.report.error;
  return <div className="narrow-page">
    <Card className="post-detail"><div className="post-detail-header"><div><p className="eyebrow">r/{value.community.name}</p><h1>{value.title}</h1><p className="meta">by <Link to={value.author === null ? "/" : `/u/${value.author.username}`}>{value.author?.username ?? "deleted user"}</Link>  |  {relativeTime(value.createdAt)}  |  {value.type} post</p></div><div className="score-box"><strong>{value.score}</strong><span>score</span></div></div>
      {value.type === "text" ? <p className="post-body">{value.text}</p> : value.type === "link" && value.url !== null ? <button className="post-link" type="button" onClick={() => window.open(value.url ?? "", "_blank", "noopener,noreferrer")}>{value.url}</button> : value.type === "image" && value.image !== null ? <img className="post-image" src={value.image.data} alt={`Image for ${value.title}`} /> : null}
      <div className="action-row">{session !== null ? <><Button variant="quiet" action={() => voteActions.vote.mutate({ postId: value.id, value: 1 })}>Upvote</Button><Button variant="quiet" action={() => voteActions.vote.mutate({ postId: value.id, value: -1 })}>Downvote</Button><Button variant="quiet" action={() => voteActions.removePostVote.mutate(value.id)}>Remove vote</Button></> : <Link className="button button-quiet" to="/auth">Sign in to vote</Link>}{isAuthor ? <Button variant="quiet" action={() => { setEditTitle(value.title); setEditText(value.text ?? ""); setEditUrl(value.url ?? ""); setEditImage(null); setEditing((current) => !current); }}>Edit</Button> : null}{isAuthor ? <Button variant="danger" action={() => deletePost(postActions.deleteOwn)}>Delete</Button> : null}{session !== null ? <ModerationAction communityId={value.community.id} action={() => deletePost(postActions.deleteModerated)}>Remove as moderator</ModerationAction> : null}</div>
    </Card>
    {postError !== null ? <p className="form-error" role="alert">{errorMessage(postError)}</p> : null}
    {editing ? <Card><h2>Edit post</h2><form className="form-stack" onSubmit={savePost}><Field id="edit-post-title" label="Title" value={editTitle} onChange={setEditTitle} required />{value.type === "text" ? <Field id="edit-post-text" label="Text" value={editText} onChange={setEditText} multiline required /> : value.type === "link" ? <Field id="edit-post-url" label="URL" type="url" value={editUrl} onChange={setEditUrl} required /> : <label className="field"><span>Image</span><input aria-label="Replacement post image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file !== undefined) void fileToMedia(file).then(setEditImage).catch((error: unknown) => toast.error(errorMessage(error))); }} /></label>}<Button type="submit" disabled={postActions.update.isPending}>Save post</Button></form></Card> : null}
    {session !== null ? <Card><h2>Join the discussion</h2><form className="form-stack" onSubmit={submitComment}><Field id="comment" label="Comment" value={commentText} onChange={setCommentText} required multiline /><Button type="submit" disabled={commentActions.create.isPending}>Comment</Button>{commentActions.create.error !== null ? <p className="form-error" role="alert">{errorMessage(commentActions.create.error)}</p> : null}</form></Card> : <Card><p><Link to="/auth">Sign in</Link> to comment or report. Public reading remains available.</p></Card>}
    <Card><div className="section-heading"><h2>Comments ({value.commentCount})</h2><label>Sort<select aria-label="Comment sort" value={sort} onChange={(event) => setCommentParam("commentSort", event.target.value === "best" ? null : event.target.value)}><option value="best">Best</option><option value="new">New</option><option value="controversial">Controversial</option></select></label></div>{comments.isPending ? <PageState title="Loading comments" /> : comments.isError ? <PageState title="Comments unavailable" error={comments.error} onRetry={() => void comments.refetch()} /> : comments.data.data.length === 0 ? <PageState title="No comments" message="Be the first to add context." /> : <div className="comment-tree">{comments.data.data.map((comment) => <CommentBranch key={comment.id} comment={comment} postId={props.postId} communityId={value.community.id} username={session?.user.username} commentActions={commentActions} voteActions={voteActions} reportActions={reportActions} />)}</div>}{comments.data !== undefined ? <Pagination current={comments.data.pagination.current} hasNext={comments.data.pagination.current < comments.data.pagination.pages} reset={comments.data.pagination.reset} onChange={(next) => setCommentParam("commentPage", String(next))} /> : null}</Card>
    {reportActions.report.error !== null ? <p className="form-error" role="alert">{errorMessage(reportActions.report.error)}</p> : null}<Card className="report-card"><h2>Report this post</h2><form className="form-stack" onSubmit={(event) => {
    event.preventDefault();
    reportActions.report.mutate({ postId: value.id, reason: reportReason }, { onSuccess: () => { toast.success("Report submitted to scoped moderators"); setReportReason(""); } });
  }}><Field id="reason" label="Reason" value={reportReason} onChange={setReportReason} multiline required /><Button type="submit" disabled={session === null || reportActions.report.isPending}>Submit report</Button></form></Card>
  </div>;
}

function CommentBranch(props: { comment: IComment; postId: string; communityId: string; username?: string; commentActions: ReturnType<typeof useCommentActions>; voteActions: ReturnType<typeof useVoteActions>; reportActions: ReturnType<typeof useReportActions> }) {
  const [reply, setReply] = useState("");
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(props.comment.text ?? "");
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const canEdit = props.comment.author !== null && props.comment.author.toLowerCase() === props.username?.toLowerCase();
  return <div className="comment-branch"><div className="comment-body"><p className="comment-meta"><strong>{props.comment.author ?? "deleted user"}</strong>  |  {relativeTime(props.comment.createdAt)}  |  score {props.comment.score}</p><p>{props.comment.text ?? "[deleted comment]"}</p><div className="action-row">{props.username !== undefined ? <><Button variant="quiet" action={() => props.voteActions.vote.mutate({ commentId: props.comment.id, value: 1 })}>Upvote</Button><Button variant="quiet" action={() => props.voteActions.vote.mutate({ commentId: props.comment.id, value: -1 })}>Downvote</Button><Button variant="quiet" action={() => props.voteActions.removeCommentVote.mutate(props.comment.id)}>Remove vote</Button></> : <Link className="button button-quiet" to="/auth">Sign in to vote</Link>}{canEdit ? <Button variant="quiet" action={() => setEditing((current) => !current)}>Edit</Button> : null}{canEdit ? <Button variant="danger" action={() => props.commentActions.deleteOwn.mutate(props.comment.id)}>Delete</Button> : null}{props.username !== undefined ? <Button variant="quiet" action={() => setReporting((current) => !current)}>Report</Button> : null}{props.username !== undefined ? <ModerationAction communityId={props.communityId} action={() => props.commentActions.deleteModerated.mutate(props.comment.id)}>Remove as moderator</ModerationAction> : null}</div>{editing ? <form className="inline-form" onSubmit={(event) => { event.preventDefault(); props.commentActions.update.mutate({ id: props.comment.id, body: { text } }, { onSuccess: () => setEditing(false) }); }}><Field id={`edit-comment-${props.comment.id}`} label="Edit comment" value={text} onChange={setText} multiline required /><Button type="submit">Save</Button></form> : null}{reporting ? <form className="inline-form" onSubmit={(event) => { event.preventDefault(); props.reportActions.report.mutate({ commentId: props.comment.id, reason: reportReason }, { onSuccess: () => { setReportReason(""); setReporting(false); toast.success("Comment report submitted"); } }); }}><Field id={`report-comment-${props.comment.id}`} label="Report reason" value={reportReason} onChange={setReportReason} required /><Button type="submit">Report comment</Button></form> : null}{props.comment.text !== null ? <form className="inline-form" onSubmit={(event) => {
    event.preventDefault();
    props.commentActions.create.mutate({ postId: props.postId, parentId: props.comment.id, text: reply }, { onSuccess: () => setReply("") });
  }}><Field id={`reply-${props.comment.id}`} label="Reply" value={reply} onChange={setReply} placeholder="Add a reply" required /><Button type="submit">Reply</Button></form> : null}</div>{props.comment.replies.length > 0 ? <div className="replies">{props.comment.replies.map((child) => <CommentBranch key={child.id} comment={child} postId={props.postId} communityId={props.communityId} username={props.username} commentActions={props.commentActions} voteActions={props.voteActions} reportActions={props.reportActions} />)}</div> : null}</div>;
}

function ModerationAction(props: { communityId: string; action: () => void; children: string }) {
  const access = useModerationQueries(props.communityId, { limit: 1 });
  if (access.reports.isSuccess === false) return null;
  return <Button variant="danger" disabled={!access.reports.isSuccess} action={props.action}>{props.children}</Button>;
}
