import { Link, Route, Routes, useParams } from "react-router-dom";

import { AppFrame } from "@/components/app-frame";
import { AuthPage } from "@/components/auth-page";
import { CommunitiesPage } from "@/components/communities-page";
import { CommunityPage } from "@/components/community-page";
import { FeedPage } from "@/components/feed-page";
import { PostPage } from "@/components/post-page";
import { ProfilePage } from "@/components/profile-page";
import { SettingsPage } from "@/components/settings-page";
import { PageState } from "@/components/ui";
import { GalleryPage } from "@/components/dev/gallery-page";
import { AppProviders } from "@/components/providers/app-providers";

export function App() {
  return <AppProviders><Routes><Route element={<AppFrame />}><Route path="/" element={<FeedPage kind="home" />} /><Route path="/popular" element={<FeedPage kind="popular" />} /><Route path="/auth" element={<AuthPage />} /><Route path="/communities" element={<CommunitiesPage />} /><Route path="/subscriptions" element={<CommunitiesPage subscriptionsOnly />} /><Route path="/community/:communityId" element={<CommunityRoute />} /><Route path="/post/:postId" element={<PostRoute />} /><Route path="/u/:username" element={<ProfileRoute />} /><Route path="/settings" element={<SettingsPage />} />{import.meta.env.DEV ? <Route path="/__dev/gallery" element={<GalleryPage />} /> : null}<Route path="*" element={<NotFoundPage />} /></Route></Routes></AppProviders>;
}

function NotFoundPage() {
  return <div className="narrow-page"><PageState title="Page not found" message="That route does not exist in this discussion space." /><Link className="button button-primary" to="/">Return home</Link></div>;
}

function CommunityRoute() {
  const { communityId = "" } = useParams();
  return <CommunityPage communityId={communityId} />;
}

function PostRoute() {
  const { postId = "" } = useParams();
  return <PostPage postId={postId} />;
}

function ProfileRoute() {
  const { username = "" } = useParams();
  return <ProfilePage username={decodeURIComponent(username)} />;
}
