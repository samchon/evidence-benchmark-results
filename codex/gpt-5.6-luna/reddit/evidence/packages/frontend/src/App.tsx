import { Navigate, Route, Routes } from "react-router-dom";

import { AuthPage } from "./components/auth/auth-page";
import { AppShell } from "./components/layout/app-shell";
import { CommunityPage } from "./components/community/community-page";
import { HomePage } from "./components/home/home-page";
import { PostPage } from "./components/post/post-page";
import { ProfilePage } from "./components/profile/profile-page";
import { AppProviders } from "./components/providers/app-providers";

export function App() {
  return <AppProviders><AppShell><Routes><Route path="/" element={<HomePage />} /><Route path="/login" element={<AuthPage mode="login" />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/recovery" element={<AuthPage mode="recovery" />} /><Route path="/settings" element={<AuthPage mode="settings" />} /><Route path="/communities" element={<HomePage />} /><Route path="/communities/:id" element={<CommunityPage />} /><Route path="/post/:id" element={<PostPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="/profile/:username" element={<ProfilePage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell></AppProviders>;
}
