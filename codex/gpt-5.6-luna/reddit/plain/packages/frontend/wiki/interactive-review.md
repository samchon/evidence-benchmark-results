# Interactive browser review

Reviewed 2026-08-10 against the live Reddit backend at `http://127.0.0.1:37003`.
The Playwright Chromium browser drove the routes and interactions below; the responsive suite used the listed viewport widths.

| Screen or journey | Widths | Observations |
| --- | --- | --- |
| Home feed and post composer | 1440, 834, 390 | Named heading, sort controls, private-session boundary, and signed-in text, link, and image composers render without horizontal overflow. |
| Popular feed | 1440, 834 | Public feed heading, sort controls, and discovery rail remain readable. |
| Auth: sign in, registration, recovery request | 1440, 390 | Registration controls remain usable on phone; recovery refuses unknown email neutrally. |
| Communities catalog and name search | 1440, 834, 390 | Create-community form accepts the image fixture; exact-name search finds a newly-created community; empty results render a state card. |
| Subscriptions | 390 | Anonymous access renders the explicit `Sign in required` refusal state. |
| Community feed and moderation | 1440, 834 | Community route, icon, sort and top-range controls, empty-feed state, subscription action, pagination, moderation reports, bans, history, and refusal errors render. |
| Post discussion | 1440 | Text, link, and image post creation, type-specific post detail, vote, nested comment edit/delete, comment and post reports, and persisted reload were completed against the live backend. |
| Profile and settings | 1440 | Authored-post profile and settings routes were opened after the discussion journey. |
| Account lifecycle | 1440, 390 | Current-session continuation, password replacement, all-session logout, re-login, and account deletion completed against the live backend. |
| Shared states and routing | 1440, 834, 390 | Page-not-found, loading, empty, refusal, retry/error, long-content, and successful-mutation fixtures are available through the development state gallery; route changes move focus to main content. |

Defects found and corrected during this review:

- The home feed sent a top-time range with non-top sorts; the request is now conditional on top sorting.
- The responsive assertion matched both the navigation link and the discovery-rail link; the review locator is now exact.
- Community creation can place a new item beyond the first catalog page; the browser journey searches by the created name before opening it.
- The preview must be built with `VITE_API_HOST=http://127.0.0.1:37003`; the live gate was rerun with that baked API host after the correction.

Final browser evidence: the live journey suite contains four account/public/refusal/lifecycle journeys, and `pnpm ui:review` covers desktop, tablet, and phone route checks.


