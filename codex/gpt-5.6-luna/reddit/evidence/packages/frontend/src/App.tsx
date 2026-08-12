import { Navigate, Route, Routes } from "react-router-dom";
import { AppFrame } from "@/components/app-frame";
import { AppProviders } from "@/components/providers/app-providers";
import { AuthPage } from "@/components/auth/auth-page";
import { CommunityPage } from "@/components/community/community-page";
import { FeedPage } from "@/components/feed/feed-page";
import { HealthPage } from "@/components/health/health-page";
import { ModerationPage } from "@/components/moderation/moderation-page";
import { PostPage } from "@/components/post/post-page";
import { ProfilePage, SettingsPage } from "@/components/profile/profile-page";
import { SubscriptionPage } from "@/components/subscription/subscription-page";

/** Owns the URL route table; filters, pagination, and opened resources remain URL-addressable. */
export function App() {
  return <AppProviders><Routes>
    <Route element={<AppFrame />}>
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/communities" element={<CommunityPage />} />
      <Route path="/communities/:id" element={<CommunityPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/subscriptions" element={<SubscriptionPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/moderation/:communityId" element={<ModerationPage />} />
      <Route path="/health" element={<HealthPage />} />
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Route>
  </Routes></AppProviders>;
}
