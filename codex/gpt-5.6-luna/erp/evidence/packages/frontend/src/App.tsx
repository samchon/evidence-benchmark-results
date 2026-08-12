import { Navigate, Route, Routes } from "react-router-dom";

import { OperationsPage } from "./components/operations/operations-page";
import { AppProviders } from "./components/providers/app-providers";

/** Renders the routed ERP workspace. */
export function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<OperationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  );
}
