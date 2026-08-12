import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSession } from "@/lib/auth/session";
import { AppProviders } from "./components/providers/app-providers";
import { AppFrame } from "./components/app-frame";
import { AuthPage } from "./components/auth/auth-page";
import { ProfilePage } from "./components/profile/profile-page";
import { TodoPage } from "./components/todo/todo-page";
import { TrashPage } from "./components/todo/trash-page";

function ProtectedLayout() {
  const session = useSession();
  const location = useLocation();
  if (session.status === "anonymous") return <Navigate replace to="/login" state={{ from: location }} />;
  return <AppFrame />;
}

export function App() {
  return <AppProviders><Routes><Route path="/login" element={<AuthPage />} /><Route element={<ProtectedLayout />}><Route index element={<Navigate replace to="/todos" />} /><Route path="/todos" element={<TodoPage />} /><Route path="/trash" element={<TrashPage />} /><Route path="/profile" element={<ProfilePage />} /></Route><Route path="*" element={<Navigate replace to="/todos" />} /></Routes></AppProviders>;
}
