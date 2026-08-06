import { AppProviders } from "./components/providers/app-providers";
import { OperationsPage } from "./components/operations/operations-page";
import { GalleryPage } from "./components/dev/gallery-page";

/** Renders the benchmark workspace entry screen. */
export function App() {
  return (
    <AppProviders>
      {import.meta.env.DEV && window.location.pathname === "/__gallery" ? (
        <GalleryPage />
      ) : (
        <OperationsPage />
      )}
    </AppProviders>
  );
}
