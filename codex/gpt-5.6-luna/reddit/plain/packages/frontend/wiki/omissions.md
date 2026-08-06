# Omission record

- `health.get` is infrastructure-only and is called by `useHealth`; it has no product screen because its only requirement is the process health marker.
- `logout`, `logoutAll`, `changePassword`, and `deleteAccount` are account controls in the authenticated shell rather than standalone routes.
- `getCommunity`, `profilePage`, `listComments`, `listBanHistory`, and `listReportHistory` are detail/list variants rendered by their owning screens.

## Screen traversal record

- Discover, Auth, Community, Account, Guide, and the responsive shell are walked by the browser journeys and UI review.
- Home is authenticated and is walked by the registration journey after a successful session; it is intentionally not opened anonymously because its feed contract requires Authorization.
- Post and Profile require a backend-owned UUID/username fixture; the route components render their complete read/edit/action surfaces, while backend API tests own the data lifecycle that supplies those identifiers. The live Community journey supplies a real community fixture rather than inventing identifiers.
- Moderation is permission-scoped to a community owner/moderator; it is rendered from the report/ban query hooks and is validated by the backend moderation suite rather than by an anonymous browser journey.
