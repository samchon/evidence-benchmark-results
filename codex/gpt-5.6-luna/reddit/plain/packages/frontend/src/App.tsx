import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import {
  AboutPage,
  AccountPage,
  AuthPage,
  CommunityPage,
  DiscoverPage,
  HomePage,
  ModerationPage,
  PostPage,
  ProfilePage,
} from "@/components/reddit/reddit-pages";
import { AppProviders } from "./components/providers/app-providers";

/** Route table for the requirement-backed Reddit workspace. */
export function App(): ReactElement {
  return <AppProviders><Routes>
    <Route path="/" element={<DiscoverPage />} />
    <Route path="/discover" element={<DiscoverPage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/community/:id" element={<CommunityPage />} />
    <Route path="/community/:id/moderation" element={<ModerationPage />} />
    <Route path="/post/:id" element={<PostPage />} />
    <Route path="/profile/:username" element={<ProfilePage />} />
    <Route path="/account" element={<AccountPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AppProviders>;
}
