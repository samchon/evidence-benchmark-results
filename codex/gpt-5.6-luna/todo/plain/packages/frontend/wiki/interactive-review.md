# Interactive browser review

Date: 2026-08-10

The browser review used the running Vite development server at
`http://127.0.0.1:46012` and the live backend at `http://127.0.0.1:37001`.
Screenshots were captured with the Playwright browser tool at the listed
viewport sizes.

## Screens and observations

| Screen | Widths | Walked interactions | Observation |
| --- | --- | --- | --- |
| Auth: sign in | 390, 834, 1440 | Loaded sign-in mode and checked form controls, account toggle, recovery action, and help link | The mobile card fits within the viewport; tablet uses the available width cleanly; desktop presents the split editorial/auth layout. |
| Auth: create account | 1440 | Switched to create mode, filled display name/email/password, submitted a new account | The form exposes the required fields and transitions to the protected workspace after the live 201 response. |
| Active todos | 1440 | Checked sidebar navigation, new-todo action, completion filter, sort control, and first-use empty state | The empty state is explicit and offers a direct create action; the shell keeps workspace/account navigation visible. |
| Active todos: responsive | 390, 834 | Resized the protected shell and checked list/detail stacking and navigation | The sidebar/navigation treatment remains usable at narrow widths and the content column does not overflow. |
| Todo detail/history | 1440 | Created a todo, opened detail, edited it with the current version, reopened history, completed it, and moved it to trash | The detail surface shows status, version, edit state, history, and destructive-action confirmation in the same journey. |
| Trash | 390, 834, 1440 | Opened trash, inspected preserved detail, restored the todo, and verified the empty result | Trash supports recovery without losing the detail context; the empty state is readable on mobile and tablet widths. |
| Account settings | 390, 834, 1440 | Opened profile, password, session, logout-all, and delete-account controls; exercised confirmation/refusal paths | Account operations are grouped into understandable sections and stack into a single readable column on narrow screens. |
| Development state gallery | 390, 834, 1440 | Opened the DEV-only fixture route and inspected loading, both empty states, refusal, retryable error, post-mutation success, and long/boundary values | Fixture cards stack cleanly on mobile and remain balanced in two columns at tablet and desktop widths; the route is excluded from production navigation. |

## Defects found and fixed during the walk

- Added the router/provider composition so direct `/app`, `/trash`, and
  `/settings` navigation renders instead of a blank page.
- Changed refresh-session hook ownership so the auth provider does not consume
  auth context before the provider exists.
- Corrected the live browser API target from the runner-injected port to the
  workspace backend port 37001; the browser then observed successful join,
  todo mutation, health, history, completion, trash, restore, and profile
  requests.
- Replaced ambiguous journey row assertions with scoped row locators.
- Added complete active/trash projections, both directions for date sorting,
  full changed-value history rendering, and retry states for detail/list
  failures.
- Wired recovery confirmation into the authenticated session and forced a
  fresh login after password replacement, matching the backend security
  consequences.
- Added no-op edit refusal feedback and kept the editor open after a stale or
  rejected save so the user can reload or retry.
- Moved active-list completion, sort, and pagination state plus trash
  pagination into URL parameters, and added live assertions for URL-preserved
  sorting, pagination, and reload behavior.
- Cleared private query caches on sign-out and exercised password replacement,
  stale-editor refusal, logout-all invalidation, account deletion, and
  cross-account list isolation in live browser journeys.
- Added a DEV-only state gallery so loading, empty, refusal, retryable error,
  successful mutation, and long-value fixtures can be inspected deterministically
  without changing live workspace data.
- Added an inline favicon so the browser review completes without a missing
  `/favicon.ico` resource error.

The authenticated in-app navigation review rendered the protected screens
without an unhandled UI error. A separate direct-navigation attempt after an
expired refresh recorded the expected 401 responses for the protected request
and refresh endpoint; re-authentication restored the session and in-app
navigation then succeeded. The Playwright journey suite separately verifies
the complete live create/edit/history/complete/incomplete/trash/restore/erase
path, profile update and password replacement, stale-version refusal, URL
state, session invalidation, account isolation, and generic recovery refusal
copy.
