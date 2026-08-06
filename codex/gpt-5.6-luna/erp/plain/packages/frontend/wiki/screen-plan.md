# Frontend screen plan

The ERP surface is organized around the requirement actors and seven delivery cycles. The shell is shared by every screen; URL filters remain local to each module route.

| Screen | Requirement / actor | Operations | Journey |
| --- | --- | --- | --- |
| Dashboard | REQ-NFR-REPORT, authorized user | activity, attention, report links | `journey_dashboard_navigation` |
| Login | REQ-AUTH-PROVISION-004/005, User | login, refresh, logout | `journey_authentication` |
| Profile & access | REQ-AUTH-ACCOUNT, User | profile, organization selection | `journey_profile_access` |
| Module workspace | REQ-FUN-* for the active module, authorized manager | typed list accessor, filters, export and lifecycle entry | `journey_module_workspace` |
| Published operations | REQ-NFR-DELIVERY, authorized user | complete generated SDK operation catalog and typed command runner | `published operations catalog journey` |

Module routes cover finance, procurement, sales, inventory, people/payroll, assets, manufacturing, quality, service and reports. Empty, loading, refusal, retry and populated states are rendered by the shared module screen; every published command is reachable from the typed command runner. Journeys run against the live API when `VITE_API_SIMULATE=false` and use the SDK simulation boundary only when explicitly enabled.
