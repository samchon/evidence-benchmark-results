import { useState, type FormEvent } from "react";
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
import { errorMessage, useProfileQuery, useUpdateProfile } from "@/lib/hooks";
import { fileToMedia } from "@/lib/media";

export function ProfilePage(props: { username: string }) {
  const { session } = useSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const postPageValue = Number(searchParams.get("postsPage") ?? "1");
  const postPage = Number.isInteger(postPageValue) && postPageValue > 0
    ? postPageValue
    : 1;
  const commentPageValue = Number(searchParams.get("commentsPage") ?? "1");
  const commentPage = Number.isInteger(commentPageValue) && commentPageValue > 0
    ? commentPageValue
    : 1;
  const profile = useProfileQuery(props.username, {
    posts: { page: postPage, limit: 8 },
    comments: { page: commentPage, limit: 8 },
  });
  const canEdit = session?.user.username.toLowerCase() === props.username.toLowerCase();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<Awaited<ReturnType<typeof fileToMedia>> | undefined>(
    undefined,
  );
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const update = useUpdateProfile();
  const setPage = (key: "postsPage" | "commentsPage", next: number): void => {
    setSearchParams((current) => {
      const nextParams = new URLSearchParams(current);
      nextParams.set(key, String(next));
      return nextParams;
    });
  };
  const submit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const body = removeAvatar
      ? { displayName, bio, avatar: null }
      : avatar === undefined
        ? { displayName, bio }
        : { displayName, bio, avatar };
    update.mutate(body, {
      onSuccess: () => {
        toast.success("Profile updated");
        setEditing(false);
        void profile.refetch();
      },
    });
  };
  if (profile.isPending) return <PageState title="Loading profile" message="Gathering public profile and authorship." />;
  if (profile.isError) return <PageState title="Profile not found" error={profile.error} onRetry={() => void profile.refetch()} />;
  const value = profile.data;
  return <div className="page-grid"><section className="main-column"><Card className="profile-hero"><div className="avatar">{value.avatar === null ? value.displayName.slice(0, 1).toUpperCase() : <img src={value.avatar.data} alt={`Avatar for ${value.displayName}`} />}</div><div><p className="eyebrow">Public profile</p><h1>{value.displayName}</h1><p className="meta">u/{value.username}  |  {value.karma} karma</p><p>{value.bio || "No biography yet."}</p></div>{canEdit ? <Button variant="quiet" action={() => { setDisplayName(value.displayName); setBio(value.bio); setAvatar(undefined); setRemoveAvatar(false); setEditing((current) => !current); }}>Edit profile</Button> : null}</Card>{editing ? <Card><h2>Edit public profile</h2><form className="form-stack" onSubmit={submit}><Field id="profile-display-name" label="Display name" value={displayName} onChange={setDisplayName} required /><Field id="profile-bio" label="Bio" value={bio} onChange={setBio} multiline /><label className="field"><span>Avatar</span><input aria-label="Profile avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file !== undefined) void fileToMedia(file).then((next) => { setAvatar(next); setRemoveAvatar(false); }).catch((error: unknown) => toast.error(errorMessage(error))); }} /></label>{value.avatar !== null ? <Button type="button" variant="quiet" action={() => { setAvatar(undefined); setRemoveAvatar(true); }}>Remove current avatar</Button> : null}{update.error !== null ? <p className="form-error" role="alert">{errorMessage(update.error)}</p> : null}<Button type="submit" disabled={update.isPending}>Save profile</Button></form></Card> : null}<Card><div className="section-heading"><h2>Authored posts</h2><span className="count">{value.posts.data.length}</span></div>{value.posts.data.length === 0 ? <p className="muted">No available posts.</p> : <div className="stack">{value.posts.data.map((post) => <PostCard key={post.id} post={post} />)}</div>}<Pagination current={value.posts.pagination.current} hasNext={value.posts.pagination.current < value.posts.pagination.pages} reset={value.posts.pagination.reset} onChange={(next) => setPage("postsPage", next)} /></Card><Card><div className="section-heading"><h2>Authored comments</h2><span className="count">{value.comments.data.length}</span></div>{value.comments.data.length === 0 ? <p className="muted">No available comments.</p> : <div className="stack">{value.comments.data.map((comment) => <div className="comment-summary" key={comment.id}><p>{comment.text ?? "[deleted comment]"}</p><p className="meta"><Link to={`/post/${comment.postId}`}>Open post</Link>  |  score {comment.score}  |  {new Date(comment.createdAt).toLocaleDateString()}</p></div>)}</div>}<Pagination current={value.comments.pagination.current} hasNext={value.comments.pagination.current < value.comments.pagination.pages} reset={value.comments.pagination.reset} onChange={(next) => setPage("commentsPage", next)} /></Card></section><aside className="side-column"><Card><h2>Identity boundaries</h2><p>Email, password, sessions, votes cast, reports, and moderation history never appear on a public profile.</p></Card></aside></div>;
}


