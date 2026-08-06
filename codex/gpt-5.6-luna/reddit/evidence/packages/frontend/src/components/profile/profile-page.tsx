import { Link, useParams } from "react-router-dom";
import { useProfile, useProfileUpdate } from "@/lib/profile/hooks";
import type * as ProfileHooks from "../../lib/profile/hooks";

/**
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model The profile view renders the public identity and authored-content summary returned by the API.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model The public profile presents the user's aggregate karma.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total The profile renders one signed karma total.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations The page exposes profile loading and the authenticated save action.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules The edit form constrains the profile fields and reports mutation errors.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content The profile route keeps public profile content available without exposing private session data.
 * @evidence {@link ProfileHooks.useProfile} Used by this screen.
 * @evidence {@link ProfileHooks.useProfileUpdate} Used by this screen.
 */
export function ProfilePage() {
  const { username = "me" } = useParams(); const profile = useProfile(username); const update = useProfileUpdate();
  const save = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); void update.mutateAsync({ displayName: String(data.displayName), bio: String(data.bio), avatarUrl: String(data.avatarUrl) || null }); };
  return <div className="page-grid"><section className="panel hero"><p className="eyebrow">Public profile</p><h1>@{profile.data?.username ?? username}</h1><p>{profile.data?.bio ?? "This profile keeps identity, karma, and authored content visible without exposing credentials."}</p><dl className="stats"><div><dt>Karma</dt><dd>{profile.data?.karma ?? 0}</dd></div><div><dt>Posts</dt><dd>{profile.data?.posts?.data.length ?? 0}</dd></div></dl></section><section className="panel"><h2>Authored posts</h2><div className="stack">{profile.data?.posts?.data.map((post) => <Link className="card compact" to={`/post/${post.id}`} key={post.id}>{post.title}</Link>)}</div></section><section className="panel"><h2>Edit profile</h2><form className="stack" onSubmit={save}><label>Display name<input aria-label="Display name" name="displayName" defaultValue={profile.data?.displayName ?? ""} /></label><label>Bio<textarea aria-label="Bio" name="bio" defaultValue={profile.data?.bio ?? ""} /></label><label>Avatar URL<input aria-label="Avatar URL" type="url" name="avatarUrl" defaultValue={profile.data?.avatarUrl ?? ""} /></label><button aria-label="Save profile" type="submit">Save profile</button></form>{update.isSuccess ? <p role="status">Profile saved.</p> : null}{update.error instanceof Error ? <p className="error" role="alert">{update.error.message}</p> : null}</section></div>;
}
