# Frontend screen plan

The private todo workspace is a single responsive shell with route-owned views.

| Screen | Requirement and actor | SDK operations | Journey |
| --- | --- | --- | --- |
| Sign in | REQ-AUTH-PROVISION-2, anonymous user | `login`, `refresh` | `journey_auth` |
| Register | REQ-AUTH-PROVISION-1, anonymous user | `join` | `journey_auth` |
| Recover | REQ-AUTH-MANAGE-2, anonymous user | `recoverStart`, `recover` | `journey_auth` |
| Todo workspace | REQ-FUNC-TODO-1..7, authenticated user | `todo.create`, `todo.index`, `todo.at`, `todo.update`, `todo.complete`, `todo.incomplete`, `todo.erase` | `journey_todos` |
| Todo history | REQ-FUNC-HISTORY-1, authenticated user | `todo.history` | `journey_todos` |
| Trash | REQ-FUNC-TRASH-1..4, authenticated user | `trash.index`, `trash.at`, `trash.history`, `trash.restore`, `trash.erase` | `journey_todos` |
| Profile and security | REQ-FUNC-PROFILE-1..2 and REQ-AUTH-MANAGE-1,3, authenticated user | `profile.at`, `profile.update`, `changePassword`, `deleteAccount` | `journey_account` |
| Session controls | REQ-AUTH-SESSION-1..3, authenticated user | `refresh`, `logout`, `logoutAll` | `journey_account` |
| Health boundary | REQ-NFR-INTEGRITY-1, infrastructure | `health.get` | `journey_health` |

Every published accessor is consumed by a domain hook. The history and security
operations are intentionally inline panels inside their owning screen because they
are user actions on the same account, not separate resources.
