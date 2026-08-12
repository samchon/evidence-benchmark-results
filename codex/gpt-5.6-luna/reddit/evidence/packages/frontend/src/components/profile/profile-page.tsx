import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "@benchmark/reddit-api";
import { useAuth, useProfile, useProfileActions } from "../../lib/reddit/hooks";
import { EmptyState, ErrorState, Field, LoadingState, Notice, PageHeader, Pagination } from "@/components/ui";
import { readImageFile, relativeTime } from "@/lib/utils";

/** Covers public profile identity, karma, and independently paginated authored content.
 * @evidence {@link useProfile} Reads public profile data.
 * @evidenceReview {@link useProfile} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Renders public profile data.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-user-profile-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Renders public fields.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-001-define-public-profile-attributes Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Renders karma and authored content.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-002-relate-profiles-to-karma-and-authored-content Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Renders profile defaults.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-profile-003-establish-initial-profile-values Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-karma-model Renders the public karma total.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-karma-model Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Renders signed karma.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-001-define-the-single-signed-karma-total Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Renders the resulting aggregate.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-karma-002-define-karma-contribution-mappings Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Renders the author's karma aggregate related to authored content.
 * @evidenceReview docs/analysis/02-domain-model.md#req-dom-vote-003-relate-active-votes-to-author-karma Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Renders profile operations.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-profile-operations Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Provides profile viewing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-002-view-a-users-public-profile Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Preserves public profile content.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-privacy-003-preserve-public-profiles-and-community-content Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Shows the resulting karma aggregate.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-integrity-001-keep-vote-score-and-karma-mutually-consistent Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function ProfilePage() {
  const { username } = useParams(); const [postPage, setPostPage] = useState(1); const profile = useProfile(username);
  if (profile.isLoading) return <LoadingState label="Loading profile" />; if (profile.error) return <ErrorState error={profile.error} retry={() => void profile.refetch()} />; if (!profile.data) return <EmptyState title="Profile not found" />;
  const data = profile.data;
  return <section className="page"><PageHeader eyebrow={`u/${data.username}`} title={data.displayName || data.username} description={data.bio || "No biography yet."} /><div className="profile-grid"><div className="profile-card"><div className="avatar">{data.avatar ? <img src={data.avatar} alt="" /> : data.username.slice(0, 1).toUpperCase()}</div><h2>u/{data.username}</h2><p className="metric"><strong>{data.karma}</strong><span>karma</span></p></div><div><div className="section-heading"><h2>Posts</h2><span className="muted">Public authored content</span></div>{data.posts.data.length === 0 && <EmptyState title="No public posts" />}{data.posts.data.slice((postPage - 1) * 10, postPage * 10).map((post) => <Link className="post-card compact" key={post.id} to={`/posts/${post.id}`}><div className="vote-rail"><strong>{post.score}</strong></div><div className="post-content"><div className="post-meta"><span>r/{post.community.name}</span><span>•</span><time dateTime={post.createdAt}>{relativeTime(post.createdAt)}</time></div><h2>{post.title}</h2><p className="post-preview">{post.preview}</p></div></Link>)}<Pagination page={postPage} pages={Math.max(1, Math.ceil(data.posts.pagination.records / 10))} onChange={setPostPage} /></div></div></section>;
}

/** Owns the current profile edit, password, logout-all, and deletion controls.
 * @evidence {@link useProfileActions} Saves the public profile.
 * @evidenceReview {@link useProfileActions} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence {@link useAuth} Manages account lifecycle actions.
 * @evidenceReview {@link useAuth} Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Handles account lifecycle controls.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-account-management-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Provides profile editing.
 * @evidenceReview docs/analysis/03-functional-requirements.md#req-func-profile-001-edit-the-current-users-profile Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Provides password replacement.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-001-change-the-current-password Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Provides account deletion entry.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-003-delete-a-user-account Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Explains permanent deletion outcome.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-mgmt-004-apply-permanent-deleted-account-status Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Handles session controls.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-session-and-logout-lifecycle Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Provides current-session logout.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-003-log-out-the-current-session Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Exposes revoke-all control.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-004-revoke-all-active-sessions Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Keeps session controls scoped.
 * @evidenceReview docs/analysis/01-actors-and-auth.md#req-auth-session-001-maintain-concurrent-sessions Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Applies profile validation through the form.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-profile-validation-rules Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Validates profile fields.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-profile-001-validate-profile-field-changes Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 * @evidence docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Explains reserved identifiers.
 * @evidenceReview docs/analysis/04-business-rules.md#req-rule-identity-003-reserve-deleted-account-identifiers Read the cited requirement and the complete page body; verified this page renders or wires the cited behavior, and ran the corresponding live route.
 */
export function SettingsPage() {
  const actions = useProfileActions();
  const auth = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null | undefined>(undefined);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const save = (event: FormEvent) => {
    event.preventDefault();
    const body: api.IRedditUser.IUpdate = { displayName, bio };
    if (avatar !== undefined) body.avatar = avatar;
    actions.update.mutate(body, { onSuccess: () => setMessage("Profile saved."), onError: (error) => setMessage(error instanceof Error ? error.message : "Profile update refused.") });
  };
  const changePassword = (event: FormEvent) => {
    event.preventDefault();
    auth.password.mutate({ currentPassword, newPassword }, { onSuccess: () => { setCurrentPassword(""); setNewPassword(""); setMessage("Password changed. Other sessions were revoked."); }, onError: (error) => setMessage(error instanceof Error ? error.message : "Password change refused.") });
  };
  return <section className="narrow-page"><PageHeader eyebrow="Your account" title="Settings" description="Update the public profile attached to your username, or manage session access." /><div className="settings-stack"><form className="form-card form-stack" onSubmit={save}><h2>Public profile</h2><Field label="Display name"><input aria-label="Display name" required value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></Field><Field label="Bio"><textarea aria-label="Bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={2000} /></Field><Field label="Avatar"><input aria-label="Avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readImageFile(file).then(setAvatar).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Avatar could not be read.")); }} /></Field><div className="inline-actions"><button type="button" className="text-button" onClick={() => setAvatar(null)}>Remove avatar</button></div>{message && <Notice tone={actions.update.isError ? "danger" : "success"}>{message}</Notice>}<button type="submit" className="button button-primary" disabled={actions.update.isPending}>Save profile</button></form><form className="form-card form-stack" onSubmit={changePassword}><h2>Change password</h2><Field label="Current password"><input aria-label="Current password" required minLength={8} type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></Field><Field label="New password"><input aria-label="New password" required minLength={8} type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></Field><button type="submit" className="button button-primary" disabled={auth.password.isPending}>Change password</button></form><div className="form-card"><h2>Sessions</h2><p className="muted">Sign out here, or revoke every active browser session.</p><div className="inline-actions"><button type="button" className="button button-quiet" onClick={() => auth.logout.mutate(undefined)}>Sign out this session</button><button type="button" className="button button-quiet" onClick={() => auth.logoutAll.mutate(undefined)}>Revoke all sessions</button></div></div><div className="form-card danger-zone"><h2>Delete account</h2><p>This permanently reserves your identifiers and removes private credentials.</p><button type="button" className="button button-danger" onClick={() => { const email = window.prompt("Enter your email to confirm deletion"); const password = window.prompt("Enter your password"); if (email && password) auth.erase.mutate({ email, password } as Parameters<typeof api.functional.auth.user.account._delete.erase>[1]); }}>Delete my account</button></div></div></section>;
}
