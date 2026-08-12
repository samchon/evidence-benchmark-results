import { useState, type FormEvent } from "react";
import type { IPost } from "@benchmark/reddit-api";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { useSession } from "@/lib/session";
import {
  Button,
  Card,
  Field,
  PageState,
  Pagination,
  PostCard,
} from "@/components/ui";
import { errorMessage, useFeed, usePostActions } from "@/lib/hooks";
import { fileToMedia } from "@/lib/media";

export function FeedPage(props: { kind: "home" | "popular" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get("sort");
  const sort: "hot" | "new" | "top" | "controversial" = sortValue === "new" || sortValue === "top" || sortValue === "controversial"
    ? sortValue
    : "hot";
  const rangeValue = searchParams.get("range");
  const range: "today" | "week" | "month" | "year" | "all" = rangeValue === "today" || rangeValue === "week" || rangeValue === "month" || rangeValue === "year"
    ? rangeValue
    : "all";
  const pageValue = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const [showComposer, setShowComposer] = useState(false);
  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [postType, setPostType] = useState<IPost["type"]>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<Awaited<ReturnType<typeof fileToMedia>> | null>(
    null,
  );
  const feed = useFeed(
    props.kind,
    sort === "top"
      ? { sort, range, page, limit: 10 }
      : { sort, page, limit: 10 },
  );
  const postActions = usePostActions();
  const { session } = useSession();
  const heading = props.kind === "home" ? "Your home" : "Popular everywhere";
  const setFeedParam = (key: string, value: string | null): void => {
    setSearchParams((current) => {
      const nextParams = new URLSearchParams(current);
      if (value === null) nextParams.delete(key);
      else nextParams.set(key, value);
      if (key !== "page") nextParams.set("page", "1");
      return nextParams;
    });
  };
  const create = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const body: IPost.ICreate = postType === "text"
      ? { communityId, title, type: "text", text }
      : postType === "link"
        ? { communityId, title, type: "link", url }
        : { communityId, title, type: "image", image: image ?? undefined };
    postActions.create.mutate(body, {
      onSuccess: () => {
        toast.success("Post published");
        setTitle("");
        setText("");
        setUrl("");
        setImage(null);
        setShowComposer(false);
      },
    });
  };
  if (props.kind === "home" && session === null)
    return <PageState title="Sign in required" message="Your home feed belongs to the authenticated account." />;
  return <div className="page-grid"><section className="main-column"><div className="page-heading"><div><p className="eyebrow">{props.kind === "home" ? "Subscribed communities" : "Public discovery"}</p><h1>{heading}</h1></div>{session !== null ? <Button action={() => setShowComposer((current) => !current)}>{showComposer ? "Close composer" : "Create a post"}</Button> : <Link className="button button-primary" to="/auth">Sign in to post</Link>}</div>{showComposer ? <Card><h2>Publish a post</h2><form className="form-stack" onSubmit={create}><Field id="community-id" label="Community ID" value={communityId} onChange={setCommunityId} required placeholder="Paste the community identifier" /><Field id="post-title" label="Title" value={title} onChange={setTitle} required /><label className="field"><span>Post type</span><select value={postType} onChange={(event) => setPostType(event.target.value as IPost["type"])}><option value="text">Text</option><option value="link">Link</option><option value="image">Image</option></select></label>{postType === "text" ? <Field id="post-text" label="Text" value={text} onChange={setText} required multiline /> : postType === "link" ? <Field id="post-url" label="URL" value={url} onChange={setUrl} required type="url" /> : <label className="field"><span>Image</span><input aria-label="Post image" type="file" accept="image/jpeg,image/png,image/webp" required onChange={(event) => { const file = event.target.files?.[0]; if (file !== undefined) void fileToMedia(file).then(setImage).catch((error: unknown) => toast.error(errorMessage(error))); }} /></label>}<Button type="submit" disabled={postActions.create.isPending || (postType === "image" && image === null)}>Publish</Button>{postActions.create.error !== null ? <p className="form-error" role="alert">{errorMessage(postActions.create.error)}</p> : null}</form></Card> : null}<Card className="feed-toolbar"><label>Sort<select aria-label="Feed sort" value={sort} onChange={(event) => setFeedParam("sort", event.target.value === "hot" ? null : event.target.value)}><option value="hot">Hot</option><option value="new">New</option><option value="top">Top</option><option value="controversial">Controversial</option></select></label>{sort === "top" ? <label>Time range<select aria-label="Top time range" value={range} onChange={(event) => setFeedParam("range", event.target.value === "all" ? null : event.target.value)}><option value="today">Today</option><option value="week">This week</option><option value="month">This month</option><option value="year">This year</option><option value="all">All time</option></select></label> : null}</Card>{feed.isPending ? <PageState title="Loading feed" message="Finding public posts for this view." /> : feed.isError ? <PageState title="Feed unavailable" error={feed.error} onRetry={() => void feed.refetch()} /> : feed.data.data.length === 0 ? <PageState title="Nothing here yet" message={props.kind === "home" ? "Subscribe to a community to shape your home feed." : "No posts match this view."} /> : <div className="stack">{feed.data.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}{feed.data !== undefined ? <Pagination current={feed.data.pagination.current} hasNext={feed.data.pagination.current < feed.data.pagination.pages} reset={feed.data.pagination.reset} onChange={(next) => setFeedParam("page", String(next))} /> : null}</section><aside className="side-column"><Card><h2>How this works</h2><p>Feeds preserve the selected sort, time range, and page size through each traversal.</p><ul className="plain-list"><li>New uses creation time.</li><li>Top uses a rolling window.</li><li>Hot balances score and age.</li><li>Controversial surfaces balanced voting.</li></ul></Card><Card><h2>Community discovery</h2><p>Public communities and posts remain readable without a subscription.</p><Link className="text-link" to="/communities">Browse communities</Link></Card></aside></div>;
}

