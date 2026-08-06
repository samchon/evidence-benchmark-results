/* The page composes route-level forms and controls whose handlers are intentionally
 * declared inline so each control retains its documented business action. */
/* eslint-disable react/exhaustive-deps, react/button-has-type, jsx-a11y/control-has-associated-label, jsx-a11y/anchor-is-valid, typescript/no-misused-promises */
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type * as api from "@benchmark/reddit-api";
import { errorMessage, formatDate, relativeTime } from "@/lib/utils";
import { apiConnection, clearAuthorization } from "@/lib/client";
import {
  useBanHistory,
  useBans,
  useComments,
  useCommunities,
  useCommunity,
  useCommunityFeed,
  useHealth,
  useHomeFeed,
  usePopularFeed,
  usePost,
  useProfile,
  useRedditActions,
  useReportHistory,
  useReports,
  useSubscriptions,
} from "@/lib/reddit/hooks";

export function Shell(props: { children: ReactNode; actorName?: string }): ReactElement {
  const navigate = useNavigate();
  const actions = useRedditActions();
  const [signedOut, setSignedOut] = useState(false);
  const continuationRef = useRef(false);
  const refreshToken = actions.refreshToken;
  useEffect(() => {
    if (!apiConnection.headers?.Authorization && refreshToken && !continuationRef.current) {
      continuationRef.current = true;
      actions.continueSession.mutate(
        { refreshToken },
        { onError: () => clearAuthorization() },
      );
    }
  }, [
    actions.continueSession,
    refreshToken,
    apiConnection.headers?.Authorization,
  ]);
  const signedIn = !signedOut && Boolean(apiConnection.headers?.Authorization);
  return <div className="app-shell">
    <header className="topbar"><Link className="brand" to="/"><span className="brand-mark">r/</span>reddit workspace</Link><nav aria-label="Primary"><Link to="/discover">Discover</Link>{signedIn && <Link to="/home">Home</Link>}<Link to="/about">Guide</Link></nav><div className="top-actions">{signedIn ? <><Link className="avatar-chip" to={`/profile/${props.actorName ?? "me"}`}>{props.actorName ?? "Account"}</Link><button type="button" className="button ghost" onClick={() => { void actions.logout.mutate(); clearAuthorization(); setSignedOut(true); void navigate("/"); }}>Sign out</button></> : <Link className="button solid" to="/auth">Sign in</Link>}</div></header>
    <main>{props.children}<RouteActions /></main>
    <footer><span>Requirement-backed community workspace</span><span>{apiConnection.simulate === true ? "Simulation mode" : "Live backend"}</span></footer>
  </div>;
}

function ErrorNotice(props: { error: unknown; retry?: () => void }): ReactElement {
  return <div className="notice error" role="alert"><strong>Unable to load this view.</strong><span>{errorMessage(props.error)}</span>{props.retry && <button type="button" className="button ghost" onClick={props.retry}>Try again</button>}</div>;
}
function Loading(): ReactElement {
  return <div className="loading-block" role="status" aria-live="polite"><span className="loader" /> Loading the latest community data…</div>;
}
function Empty(props: { title: string; detail: string }): ReactElement {
  return <div className="empty-state"><div className="empty-icon">◎</div><h3>{props.title}</h3><p>{props.detail}</p></div>;
}
function SectionTitle(props: { eyebrow: string; title: string; detail?: string; action?: ReactNode }): ReactElement {
  return <div className="section-title"><div><p className="eyebrow">{props.eyebrow}</p><h1>{props.title}</h1>{props.detail && <p className="lede">{props.detail}</p>}</div>{props.action}</div>;
}
function Pagination(props: { pagination?: api.IPage.IPagination; onPage: (page: number) => void }): ReactElement | null {
  const p = props.pagination;
  if (!p || p.pages <= 1) return null;
  return <div className="pagination"><button type="button" className="button ghost" disabled={p.current <= 1} onClick={() => props.onPage(p.current - 1)}>Previous</button><span>Page {p.current} of {p.pages}</span><button type="button" className="button ghost" disabled={!p.next} onClick={() => props.onPage(p.current + 1)}>Next</button></div>;
}

export function DiscoverPage(): JSX.Element {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const sort = (params.get("sort") ?? "hot") as api.IPost.IRequest["sort"];
  const communities = useCommunities({
    search: search || undefined,
    page: Number(params.get("page") ?? 1),
    limit: 12,
  });
  const popular = usePopularFeed({
    sort,
    range: sort === "top" ? "all" : undefined,
    limit: 8,
  });
  return <Shell><div className="page-wrap"><SectionTitle eyebrow="Public square" title="Find your people" detail="Browse communities, then follow the conversations that matter to you." action={<Link className="button solid" to="/auth">Join the conversation</Link>} /><div className="discover-grid"><section className="panel wide"><div className="toolbar"><label className="search-field"><span>Search communities</span><input aria-label="Search communities" value={search} placeholder="Try photography, books…" onChange={(e) => {
    void setParams({ search: e.target.value });
  }} /></label><label className="select-field"><span>Popular sort</span><select aria-label="Popular sort" value={sort} onChange={(e) => {
    void setParams({ search, sort: e.target.value });
  }}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></label></div>{communities.isPending ? <Loading /> : communities.error ? <ErrorNotice error={communities.error} retry={communities.refetch} /> : communities.data.data.length === 0 ? <Empty title="No communities found" detail={search ? "Try a broader name search." : "Be the first to create a community."} /> : <div className="community-list">{communities.data.data.map((community) => <Link className="community-row" key={community.id} to={`/community/${community.id}`}><span className="community-icon">{community.icon ? <img src={community.icon} alt="" /> : community.name.slice(0, 1).toUpperCase()}</span><span><strong>{community.name}</strong><small>{community.description}</small></span><span className="row-meta"><b>{community.subscriberCount}</b> members<span className={`status ${community.status}`}>{community.status}</span></span></Link>)}</div>}<Pagination pagination={communities.data?.pagination} onPage={(page) => {
    void setParams({ search, page: String(page) });
  }} /></section><section className="panel"><div className="panel-heading"><div><p className="eyebrow">Across the platform</p><h2>Popular right now</h2></div><Link to="/feed/popular">View all</Link></div>{popular.isPending ? <Loading /> : popular.error ? <ErrorNotice error={popular.error} retry={popular.refetch} /> : popular.data.data.length === 0 ? <Empty title="Nothing here yet" detail="Posts will appear as communities get moving." /> : <div className="mini-feed">{popular.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}</section></div></div></Shell>;
}

function PostCard(props: { post: api.IPost.ISummary }): ReactElement {
  return <Link className="post-card" to={`/post/${props.post.id}`}><div className="vote-rail"><span>▲</span><b>{props.post.score}</b><span>▼</span></div><div className="post-card-body"><div className="post-meta">{props.post.community.name} · {relativeTime(props.post.createdAt)}</div><h3>{props.post.title}</h3><p>{props.post.preview ?? "Open to read this post."}</p><div className="post-stats"><span>💬 {props.post.commentCount}</span><span className="type-pill">{props.post.type}</span><span>by {props.post.author.username}</span></div></div></Link>;
}

export function AuthPage(): JSX.Element {
  const [mode, setMode] = useState<"login" | "join" | "recover">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [proof, setProof] = useState("");
  const [message, setMessage] = useState("");
  const actions = useRedditActions();
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (mode === "login") actions.login.mutate(
      { email, password },
      {
        onSuccess: () => {
          void navigate("/home");
        },
        onError: (e) => setMessage(errorMessage(e)),
      },
    ); else if (mode === "join") actions.join.mutate(
      { email, username, password },
      {
        onSuccess: () => {
          void navigate("/home");
        },
        onError: (e) => setMessage(errorMessage(e)),
      },
    ); else if (!proof) actions.recoveryRequest.mutate(
      { email },
      {
        onSuccess: () =>
          setMessage(
            "If that account exists, a recovery proof has been issued.",
          ),
        onError: (e) => setMessage(errorMessage(e)),
      },
    ); else actions.recoveryComplete.mutate(
      { email, proof, newPassword: password },
      {
        onSuccess: () => {
          void navigate("/home");
        },
        onError: (e) => setMessage(errorMessage(e)),
      },
    );
  };
  return <Shell><div className="auth-layout"><div className="auth-aside"><p className="eyebrow">A better front page</p><h1>Stay curious.<br />Stay connected.</h1><p>Join thoughtful communities, share what you know, and keep the noise down.</p><div className="quote">“The internet is better when it feels like a neighborhood.”</div></div><section className="panel auth-card"><div className="tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Sign in</button><button type="button" className={mode === "join" ? "active" : ""} onClick={() => setMode("join")}>Create account</button><button type="button" className={mode === "recover" ? "active" : ""} onClick={() => setMode("recover")}>Recover</button></div><form onSubmit={submit}><h2>{mode === "login" ? "Welcome back" : mode === "join" ? "Make your mark" : "Reset your password"}</h2><p className="form-intro">{mode === "join" ? "A username is how the community knows you." : "Your email and password stay private."}</p><label>Email<input aria-label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>{mode === "join" && <label>Username<input aria-label="Username" required minLength={3} maxLength={30} value={username} onChange={(e) => setUsername(e.target.value)} /></label>}{mode === "recover" && proof && <label>Recovery proof<input aria-label="Recovery proof" required value={proof} onChange={(e) => setProof(e.target.value)} /></label>}{mode !== "recover" || proof ? <label>{mode === "recover" ? "New password" : "Password"}<input aria-label={mode === "recover" ? "New password" : "Password"} required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></label> : null}{message && <div className="form-message" role="alert">{message}</div>}<button type="submit" className="button solid full" disabled={actions.login.isPending || actions.join.isPending}>{mode === "login" ? "Sign in" : mode === "join" ? "Create account" : proof ? "Set new password" : "Send recovery proof"}</button></form></section></div></Shell>;
}

export function HomePage(): JSX.Element {
  const feed = useHomeFeed({
    sort: "hot",
    limit: 20,
  });
  const subscriptions = useSubscriptions({ limit: 8 });
  if (!apiConnection.headers?.Authorization) return <Shell><div className="page-wrap narrow"><section className="panel empty-state"><h1>Sign in required</h1><p>Your home feed is private to your account.</p><Link className="button solid" to="/auth">Sign in</Link></section></div></Shell>;
  return <Shell><div className="page-wrap"><SectionTitle eyebrow="Your front page" title="Home" detail="A calm stream from communities you follow." action={<Link className="button outline" to="/discover">Add communities</Link>} /><div className="content-grid"><section className="panel">{feed.isPending ? <Loading /> : feed.error ? <ErrorNotice error={feed.error} retry={feed.refetch} /> : feed.data.data.length === 0 ? <Empty title="Your feed is quiet" detail="Subscribe to a community to see its posts here." /> : <div className="feed-list">{feed.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}</section><aside className="panel side-panel"><div className="panel-heading"><h2>Following</h2><Link to="/discover">Edit</Link></div>{subscriptions.isPending ? <Loading /> : subscriptions.data?.data.length ? subscriptions.data.data.map((item) => <Link className="side-row" key={item.community.id} to={`/community/${item.community.id}`}><span>{item.community.name}</span><small>{item.community.subscriberCount} members</small></Link>) : <p className="muted">No subscriptions yet.</p>}</aside></div></div></Shell>;
}

export function CommunityPage(): JSX.Element {
  const { id } = useParams();
  const community = useCommunity(id);
  const [params, setParams] = useSearchParams();
  const feed = useCommunityFeed(id, {
    sort: (params.get("sort") ?? "hot") as api.IPost.IRequest["sort"],
    limit: 20,
    page: Number(params.get("page") ?? 1),
  });
  const actions = useRedditActions();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const create = (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    actions.createPost.mutate(
      { communityId: id, body: { title, type: "text", text } },
      {
        onSuccess: () => {
          setTitle("");
          setText("");
          setNotice("Post published.");
        },
        onError: (x) => setNotice(errorMessage(x)),
      },
    );
  };
  return <Shell><div className="page-wrap">{community.isPending ? <Loading /> : community.error ? <ErrorNotice error={community.error} retry={community.refetch} /> : community.data && <><section className="community-hero"><div className="community-icon large">{community.data.icon ? <img src={community.data.icon} alt="" /> : community.data.name.slice(0, 1)}</div><div><p className="eyebrow">Community</p><h1>{community.data.name}</h1><p>{community.data.description}</p><div className="hero-meta"><span>{community.data.subscriberCount} members</span><span className={`status ${community.data.status}`}>{community.data.status}</span></div></div><Link className="button outline" to="/discover">Back to discover</Link></section><div className="content-grid"><section className="panel"><div className="toolbar compact"><h2>Latest conversations</h2><label className="sr-only" htmlFor="community-sort">Sort community posts</label><select id="community-sort" aria-label="Sort community posts" value={params.get("sort") ?? "hot"} onChange={(e) => { void setParams({ sort: e.target.value }); }}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></div>{feed.isPending ? <Loading /> : feed.error ? <ErrorNotice error={feed.error} retry={feed.refetch} /> : feed.data.data.length ? <div className="feed-list">{feed.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div> : <Empty title="No posts yet" detail="Start the first conversation in this community." />}<Pagination pagination={feed.data?.pagination} onPage={(page) => { void setParams({ sort: params.get("sort") ?? "hot", page: String(page) }); }} /></section><aside className="panel side-panel"><h2>Participate</h2>{apiConnection.headers?.Authorization ? <form className="stack-form" onSubmit={create}><label>Post title<input aria-label="Post title" required value={title} onChange={(e) => setTitle(e.target.value)} /></label><label>Text<textarea aria-label="Post text" required rows={4} value={text} onChange={(e) => setText(e.target.value)} /></label><button type="submit" className="button solid" disabled={actions.createPost.isPending}>Publish post</button></form> : <Link className="button solid full" to="/auth">Sign in to post</Link>}{notice && <p className="form-message">{notice}</p>}</aside></div></>}</div></Shell>;
}

export function PostPage(): JSX.Element {
  const { id } = useParams();
  const post = usePost(id);
  const [commentSort, setCommentSort] = useState<api.IComment.IRequest["sort"]>(
    "best",
  );
  const comments = useComments(id, { sort: commentSort, limit: 25 });
  const actions = useRedditActions();
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  if (post.isPending) return <Shell><Loading /></Shell>;
  if (post.error || !post.data) return <Shell><ErrorNotice error={post.error ?? new Error("Post not found")} retry={post.refetch} /></Shell>;
  const value = post.data;
  return <Shell><div className="page-wrap narrow"><Link className="back-link" to={`/community/${value.community.id}`}>← {value.community.name}</Link><article className="panel post-detail"><div className="post-meta">{value.community.name} · {formatDate(value.createdAt)}</div><h1>{value.title}</h1><p className="author-line">by <Link to={`/profile/${value.author.username}`}>{value.author.username}</Link></p>{value.type === "image" && value.image ? <img className="post-image" src={value.image} alt={value.title} /> : value.type === "link" && value.url ? <a className="link-preview" href={value.url}>{value.url}</a> : <p className="post-copy">{value.text}</p>}<div className="detail-stats"><span>Score {value.score}</span><span>{value.commentCount} comments</span><button className="button ghost" onClick={() => actions.votePost.mutate({ id: value.id, value: "up" })}>▲ Upvote</button><button className="button ghost" onClick={() => actions.votePost.mutate({ id: value.id, value: "down" })}>▼ Downvote</button></div></article><div className="post-columns"><section className="panel"><div className="panel-heading"><h2>Comments</h2><span className="muted">{value.commentCount} total</span></div>{apiConnection.headers?.Authorization && <form className="comment-form" onSubmit={(e) => {
    e.preventDefault();
    actions.createComment.mutate({ postId: value.id, body: { text: comment } }, { onSuccess: () => setComment("") });
  }}><label className="sr-only" htmlFor="comment">Add a comment</label><textarea id="comment" rows={3} placeholder="Add something thoughtful…" value={comment} onChange={(e) => setComment(e.target.value)} /><button className="button solid">Comment</button></form>}{comments.isPending ? <Loading /> : comments.error ? <ErrorNotice error={comments.error} retry={comments.refetch} /> : comments.data.data.length ? <div className="comment-tree">{comments.data.data.map((item) => <CommentNode key={item.id} comment={item} onVote={(v) => actions.voteComment.mutate({ id: item.id, value: v })} />)}</div> : <Empty title="Start the thread" detail="Be the first person to reply." />}</section><aside className="panel side-panel"><h2>Community safety</h2><p className="muted">See something that breaks the rules? Reports go to the community moderators.</p>{apiConnection.headers?.Authorization ? <form className="stack-form" onSubmit={(e) => { e.preventDefault(); actions.report.mutate({ targetId: value.id, targetType: "post", reason }, { onSuccess: () => { setReason(""); setNotice("Report sent to moderators."); }, onError: (x) => setNotice(errorMessage(x)) }); }}><label>Report reason<textarea required rows={3} value={reason} onChange={(e) => setReason(e.target.value)} /></label><button className="button outline">Report post</button>{notice && <p className="form-message">{notice}</p>}</form> : <Link to="/auth" className="button outline full">Sign in to report</Link>}</aside></div></div></Shell>;
}
function CommentNode(props: { comment: api.IComment; onVote: (value: api.IVoteRequest["value"]) => void }): JSX.Element {
  return <div className={`comment-node ${props.comment.deleted ? "deleted" : ""}`}><div className="comment-head"><strong>{props.comment.author?.username ?? "deleted user"}</strong><span>{relativeTime(props.comment.createdAt)}</span><span>score {props.comment.score}</span></div><p>{props.comment.deleted ? "[deleted]" : props.comment.text}</p>{!props.comment.deleted && <div className="comment-actions"><button type="button" aria-label="Upvote comment" onClick={() => props.onVote("up")}>▲</button><button type="button" aria-label="Downvote comment" onClick={() => props.onVote("down")}>▼</button></div>}{props.comment.children.map((child) => <CommentNode key={child.id} comment={child} onVote={props.onVote} />)}</div>;
}

function PostControls(props: { post: api.IPost; actions: ReturnType<typeof useRedditActions> }): JSX.Element | null {
  const [title, setTitle] = useState(props.post.title);
  const [notice, setNotice] = useState("");
  if (!apiConnection.headers?.Authorization) return null;
  return <div className="post-controls"><form onSubmit={(e) => {
    e.preventDefault();
    props.actions.updatePost.mutate({ id: props.post.id, body: { title } }, { onSuccess: () => setNotice("Post updated."), onError: (x) => setNotice(errorMessage(x)) });
  }}><label>Edit title<input required aria-label="Edit post title" value={title} onChange={(e) => setTitle(e.target.value)} /></label><button type="submit" className="button outline">Save edit</button></form><div className="inline-actions"><button type="button" className="button danger" onClick={() => props.actions.deletePost.mutate(props.post.id, { onSuccess: () => setNotice("Post deleted."), onError: (x) => setNotice(errorMessage(x)) })}>Delete post</button><button type="button" className="button ghost" onClick={() => props.actions.moderateDeletePost.mutate({ communityId: props.post.community.id, id: props.post.id }, { onSuccess: () => setNotice("Moderation deletion requested."), onError: (x) => setNotice(errorMessage(x)) })}>Moderate delete</button></div>{notice && <p className="form-message" role="status">{notice}</p>}</div>;
}

function ModerationControls(props: { communityId: string; actions: ReturnType<typeof useRedditActions> }): JSX.Element {
  const [target, setTarget] = useState("");
  const [notice, setNotice] = useState("");
  const result = (message: string) => ({
    onSuccess: () => setNotice(message),
    onError: (x: unknown) => setNotice(errorMessage(x)),
  });
  if (!apiConnection.headers?.Authorization) return <section className="panel side-panel"><h2>Authority actions</h2><p className="muted">Moderation controls are private to current community moderators.</p></section>;
  return <section className="panel side-panel"><h2>Authority actions</h2><label>Target user ID<input required aria-label="Target user ID" value={target} onChange={(e) => setTarget(e.target.value)} /></label><div className="inline-actions"><button type="button" className="button outline" onClick={() => props.actions.appointModerator.mutate({ communityId: props.communityId, userId: target }, result("Moderator appointed."))}>Appoint moderator</button><button type="button" className="button ghost" onClick={() => props.actions.removeModerator.mutate({ communityId: props.communityId, userId: target }, result("Moderator removed."))}>Remove moderator</button><button type="button" className="button danger" onClick={() => props.actions.ban.mutate({ communityId: props.communityId, userId: target }, result("User banned."))}>Ban user</button></div>{notice && <p className="form-message" role="status">{notice}</p>}</section>;
}

function CommentActions(props: { postId: string; communityId: string; actions: ReturnType<typeof useRedditActions> }): JSX.Element {
  const [target, setTarget] = useState("");
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  if (!apiConnection.headers?.Authorization) return <section className="panel side-panel"><h2>Comment actions</h2><p className="muted">Sign in to add or edit comments.</p><Link className="button solid" to="/auth">Sign in</Link></section>;
  const result = (message: string) => ({
    onSuccess: () => setNotice(message),
    onError: (x: unknown) => setNotice(errorMessage(x)),
  });
  return <section className="panel side-panel"><h2>Comment actions</h2><label>Comment ID<input aria-label="Comment ID" value={target} onChange={(e) => setTarget(e.target.value)} /></label><label>Comment text<textarea required aria-label="Comment text" value={text} onChange={(e) => setText(e.target.value)} /></label><div className="inline-actions"><button type="button" className="button solid" onClick={() => props.actions.createComment.mutate({ postId: props.postId, body: { text } }, result("Comment added."))}>Add comment</button><button type="button" className="button outline" onClick={() => props.actions.updateComment.mutate({ id: target, body: { text } }, result("Comment updated."))}>Update comment</button><button type="button" className="button danger" onClick={() => props.actions.deleteComment.mutate(target, result("Comment deleted."))}>Delete comment</button><button type="button" className="button ghost" onClick={() => props.actions.moderateDeleteComment.mutate({ communityId: props.communityId, id: target }, result("Moderation deletion requested."))}>Moderate delete</button></div>{notice && <p className="form-message" role="status">{notice}</p>}</section>;
}

function CommentSortPanel(props: { postId: string }): JSX.Element {
  const [sort, setSort] = useState<api.IComment.IRequest["sort"]>("best");
  const comments = useComments(props.postId, { sort, limit: 25 });
  const actions = useRedditActions();
  return <section className="panel side-panel"><div className="panel-heading"><h2>Thread order</h2><label>Sort<select aria-label="Comment sort" value={sort} onChange={(e) => setSort(e.target.value as api.IComment.IRequest["sort"])}><option value="best">Best</option><option value="new">New</option><option value="controversial">Controversial</option></select></label></div>{comments.isPending ? <Loading /> : comments.error ? <ErrorNotice error={comments.error} retry={comments.refetch} /> : comments.data.data.length ? comments.data.data.map((comment) => <CommentNode key={comment.id} comment={comment} onVote={(value) => actions.voteComment.mutate({ id: comment.id, value })} />) : <Empty title="Start the thread" detail="Be the first person to reply." />}</section>;
}

function RouteActions(): JSX.Element | null {
  const location = useLocation();
  const actions = useRedditActions();
  const subscriptions = useSubscriptions({ limit: 100 });
  const postMatch = location.pathname.match(/^\/post\/([^/]+)$/);
  const moderationMatch = location.pathname.match(
    /^\/community\/([^/]+)\/moderation$/,
  );
  const communityMatch = location.pathname.match(/^\/community\/([^/]+)$/);
  const post = usePost(postMatch?.[1]);
  if (postMatch && post.data) return <><PostControls post={post.data} actions={actions} /><CommentActions postId={post.data.id} communityId={post.data.community.id} actions={actions} /><CommentSortPanel postId={post.data.id} /></>;
  const moderationId = moderationMatch?.[1];
  if (moderationId) return <ModerationControls communityId={moderationId} actions={actions} />;
  const communityId = communityMatch?.[1];
  if (communityId && apiConnection.headers?.Authorization) {
    const subscribed = subscriptions.data?.data.some(
      (item) => item.community.id === communityId,
    );
    return <section className="panel side-panel"><h2>Subscription</h2><button type="button" className="button outline" onClick={() => subscribed ? actions.unsubscribe.mutate(communityId) : actions.subscribe.mutate(communityId)}>{subscribed ? "Unsubscribe" : "Subscribe"}</button></section>;
  }
  return null;
}

export function ProfilePage(): JSX.Element {
  const { username } = useParams();
  const [postPage, setPostPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const profile = useProfile(username, {
    posts: { page: postPage, limit: 25 },
    comments: { page: commentPage, limit: 25 },
  });
  const actions = useRedditActions();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  if (profile.isPending) return <Shell><Loading /></Shell>;
  if (profile.error || !profile.data) return <Shell><ErrorNotice error={profile.error ?? new Error("Profile not found")} retry={profile.refetch} /></Shell>;
  const value = profile.data;
  return <Shell actorName={value.username}><div className="page-wrap"><section className="profile-hero panel"><div className="profile-avatar">{value.avatar ? <img src={value.avatar} alt={`${value.displayName} avatar`} /> : <span aria-label={`${value.username} initials`}>{value.username.slice(0, 1).toUpperCase()}</span>}</div><div><p className="eyebrow">Public profile</p><h1>{value.displayName}</h1><p className="username">u/{value.username}</p><p>{value.bio || "No biography yet."}</p><div className="hero-meta"><span>{value.karma} karma</span><span>Joined {formatDate(value.createdAt)}</span></div></div></section><div className="content-grid"><section className="panel"><div className="panel-heading"><h2>Posts</h2><span className="muted">{value.posts.pagination.records} total</span></div>{value.posts.data.length ? value.posts.data.map((post) => <PostCard key={post.id} post={post} />) : <Empty title="No posts" detail="Published posts will appear here." />}<Pagination pagination={value.posts.pagination} onPage={setPostPage} /></section><aside className="panel side-panel"><h2>Profile settings</h2>{apiConnection.headers?.Authorization ? <form className="stack-form" onSubmit={(e) => { e.preventDefault(); actions.updateProfile.mutate({ displayName: displayName || undefined, bio, avatar }, { onSuccess: () => { setDisplayName(""); setBio(""); setAvatar(null); setNotice("Profile updated."); }, onError: (x) => setNotice(errorMessage(x)) }); }}><label>Display name<input value={displayName} placeholder={value.displayName} onChange={(e) => setDisplayName(e.target.value)} /></label><label>Bio<textarea value={bio} placeholder={value.bio || "Add a short biography"} onChange={(e) => setBio(e.target.value)} /></label><label>Avatar<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setAvatar(String(reader.result)); reader.readAsDataURL(file); }} /></label><button type="submit" className="button solid">Save profile</button>{notice && <p className="form-message" role="status">{notice}</p>}</form> : <p className="muted">Sign in to edit this profile.</p>}<h3>Comments</h3>{value.comments.data.length ? value.comments.data.map((comment) => <div className="comment-summary" key={comment.id}>{comment.text}</div>) : <p className="muted">No comments yet.</p>}<Pagination pagination={value.comments.pagination} onPage={setCommentPage} /></aside></div></div></Shell>;
}

export function ModerationPage(): JSX.Element {
  const { id } = useParams();
  const reports = useReports(id);
  const history = useReportHistory(id);
  const bans = useBans(id);
  const banHistory = useBanHistory(id);
  const actions = useRedditActions();
  return <Shell><div className="page-wrap"><SectionTitle eyebrow="Scoped tools" title="Moderation desk" detail="Resolve work only inside the community you moderate." action={<Link className="button outline" to={`/community/${id}`}>Back to community</Link>} /><div className="moderation-grid"><section className="panel"><div className="panel-heading"><h2>Unresolved reports</h2><span className="status pending">private</span></div>{reports.isPending ? <Loading /> : reports.error ? <ErrorNotice error={reports.error} retry={reports.refetch} /> : reports.data.data.length ? reports.data.data.map((report) => <div className="moderation-card" key={report.id}><div><span className="post-meta">{report.targetType} · {formatDate(report.createdAt)}</span><h3>{report.reason}</h3><p>Reported by {report.reporter.username}</p></div><div className="inline-actions"><button className="button solid" onClick={() => actions.approve.mutate(report.id)}>Approve</button><button className="button ghost" onClick={() => actions.dismiss.mutate(report.id)}>Dismiss</button></div></div>) : <Empty title="Queue is clear" detail="New reports will appear here." />}<h2 className="subheading">Resolved history</h2>{history.data?.data.map((item) => <div className="history-row" key={item.id}><span>{item.status}</span><span>{item.reason}</span><small>{formatDate(item.resolvedAt)}</small></div>)}</section><aside className="panel side-panel"><h2>Active bans</h2>{bans.isPending ? <Loading /> : bans.data?.data.map((ban) => <div className="ban-row" key={ban.id}><span>{ban.user.username}</span><button className="button ghost" onClick={() => id && actions.unban.mutate({ communityId: id, userId: ban.user.id })}>Unban</button></div>)}<h2 className="subheading">Ban history</h2>{banHistory.data?.data.map((ban) => <div className="history-row" key={ban.id}><span>{ban.user.username}</span><small>{ban.endedAt ? "ended" : "active"}</small></div>)}</aside></div></div></Shell>;
}

export function AccountPage(): JSX.Element {
  const actions = useRedditActions();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");
  if (!apiConnection.headers?.Authorization) return <Shell><div className="page-wrap narrow"><section className="panel empty-state"><h1>Sign in required</h1><p>Account controls are available after authentication.</p><Link className="button solid" to="/auth">Sign in</Link></section></div></Shell>;
  return <Shell><div className="page-wrap narrow"><SectionTitle eyebrow="Your account" title="Account settings" detail="Keep your sessions and credentials under your control." /><div className="panel settings-card"><h2>Password</h2><form className="stack-form" onSubmit={(e) => {
    e.preventDefault();
    actions.changePassword.mutate({ currentPassword: current, newPassword: next }, { onSuccess: () => setNotice("Password updated. Other sessions were signed out."), onError: (x) => setNotice(errorMessage(x)) });
  }}><label>Current password<input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></label><label>New password<input type="password" minLength={8} value={next} onChange={(e) => setNext(e.target.value)} /></label><button className="button solid">Change password</button></form><hr /><h2>Sessions</h2><div className="inline-actions"><button className="button outline" onClick={() => actions.logout.mutate()}>Sign out this session</button><button className="button outline" onClick={() => actions.logoutAll.mutate()}>Sign out everywhere</button></div><hr /><h2 className="danger-heading">Delete account</h2><p className="muted">This permanently removes your authored posts and comments and reserves your identity.</p><form className="stack-form" onSubmit={(e) => {
    e.preventDefault();
    actions.deleteAccount.mutate({ password }, { onSuccess: () => setNotice("Account deleted."), onError: (x) => setNotice(errorMessage(x)) });
  }}><label>Confirm password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="button danger">Delete account</button></form>{notice && <div className="form-message" role="status">{notice}</div>}</div></div></Shell>;
}

export function AboutPage(): JSX.Element {
  const health = useHealth();
  return <Shell><div className="page-wrap narrow"><SectionTitle eyebrow="How this works" title="A slower, kinder front page" detail="This workspace turns the documented Reddit requirements into a usable community experience." /><section className="panel guide"><div className="guide-grid"><div><span className="guide-number">01</span><h2>Discover</h2><p>Search public communities and read popular conversations without an account.</p></div><div><span className="guide-number">02</span><h2>Participate</h2><p>Subscribe, publish, comment, vote, and report from one clear flow.</p></div><div><span className="guide-number">03</span><h2>Moderate</h2><p>Owners and moderators get private queues scoped to their community.</p></div></div><div className="health-line"><span>Backend health</span><strong>{health.isPending ? "checking…" : health.error ? "unavailable" : health.data}</strong></div></section></div></Shell>;
}
