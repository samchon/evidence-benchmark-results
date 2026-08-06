# Frontend screen plan

The routed application keeps one consistent shell and exposes the complete product surface:

| Route | Screen | Actor and coverage |
| --- | --- | --- |
| `/` | HomePage | Public readers see popular ranking; signed-in readers see home feed, subscriptions, community search, and creation. |
| `/login`, `/register`, `/recovery`, `/settings` | AuthPage | Anonymous and authenticated actors manage registration, sessions, recovery, password changes, and deletion. |
| `/communities/:id` | CommunityPage | Readers browse a public community, subscribe, publish, and authorized moderators manage reports, bans, roles, and removals. |
| `/post/:id` | PostPage | Readers view full content, vote, report, comment, reply, edit, delete, and inspect nested participation. |
| `/profile/:username` | ProfilePage | Readers view public profile, karma, authored content, and editable profile fields. |

The shell owns health/session indicators and the route map owns navigation continuity. Every generated accessor is wrapped by a domain hook, and every hook is rendered by one of these screens.
