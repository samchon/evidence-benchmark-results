# Frontend screen plan

The frontend keeps the account boundary visible while grouping the complete
operation surface into four user journeys rather than one page per endpoint.

| Screen | Actor | Requirements | SDK operations | Journey |
| --- | --- | --- | --- | --- |
| `/auth` | anonymous user | registration, login, recovery, credential and profile input rules | join, login, recover | `journey_auth` |
| `/app` | authenticated user | profile, active Todo creation, browsing, detail, editing, completion, history, and soft deletion | health, profile, profile update, create, index, detail, update, completion, history, trash | `journey_todo_workspace` |
| `/trash` | authenticated user | retained Todo browsing, detail, history, restore, and permanent deletion | trash index, trash detail, history, restore, erase | `journey_trash_recovery` |
| `/security` | authenticated user | refresh, current/all-session logout, password change, recovery hand-off, and account deletion | refresh, logout, logout-all, password, account deletion | `journey_security` |

The health probe is infrastructure for the authenticated workspace status
indicator, so it is consumed by `DashboardPage` and does not need its own
product page.
