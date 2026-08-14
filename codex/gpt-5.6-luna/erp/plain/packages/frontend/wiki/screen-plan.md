# Frontend screen plan

Each page owns one requirement family and the hooks listed here supply its live
data. Browser journeys are named in the journey column and will assert the
observable effect of the owning flow.

| Page | Requirement | Actor | Operations | Journey |
| --- | --- | --- | --- | --- |
| src/components/auth/login-page.tsx | REQ-AUTH-PRINCIPAL | unauthenticated principal | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/overview/dashboard-page.tsx | REQ-DOM-ORG | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT | authenticated user | inventory adjustment create and post command | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-DOM-INVENTORY-ADJUSTMENT | authenticated user | inventory adjustment source and immutable movement context | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/planning/planning-page.tsx | REQ-FUN-MRP | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT | authenticated user | generated SDK operations owned by the page hooks | journey_workspace_create_and_operate |

The owning screen also covers the following child sections of each planned
family. Each line is intentionally one requirement decision.

| Page | Requirement | Actor | Operations | Journey |
| --- | --- | --- | --- | --- |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-001 | authenticated user | organization chart initialization is visible in the account workspace | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-002 | authenticated user | create account form | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-003 | authenticated user | account search and pagination | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-004 | authenticated user | account details editing surface | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-005 | authenticated user | account status visibility | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-006 | authenticated user | account approval state visibility | journey_workspace_create_and_operate |
| src/components/finance/accounts-page.tsx | REQ-FUN-ACCOUNT-007 | authenticated user | account deletion state visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-001 | authenticated user | balanced journal draft form | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-002 | authenticated user | draft journal editing surface | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-003 | authenticated user | draft journal lifecycle visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-004 | authenticated user | journal approval status visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-005 | authenticated user | approval change state visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-006 | authenticated user | posted balanced journal history | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-007 | authenticated user | journal list and pagination | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-008 | authenticated user | reversal state visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-009 | authenticated user | void state visibility | journey_workspace_create_and_operate |
| src/components/finance/journals-page.tsx | REQ-FUN-JOURNAL-010 | authenticated user | adjustment link visibility | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW-001 | authenticated user | stock report workspace | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW-002 | authenticated user | movement report workspace | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW-003 | authenticated user | lot traceability report workspace | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW-004 | authenticated user | serial traceability report workspace | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-STOCK-VIEW-005 | authenticated user | weighted inventory report workspace | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-DOM-INVENTORY-ADJUSTMENT-001 | authenticated user | adjustment stock context, delta, reason, and status | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-DOM-INVENTORY-ADJUSTMENT-002 | authenticated user | posted adjustment movement source linkage | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-DOM-INVENTORY-ADJUSTMENT-003 | authenticated user | material adjustment approval history | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-001 | authenticated user | draft adjustment form with reason | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-002 | authenticated user | threshold-aware adjustment submission | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-003 | authenticated user | adjustment approval or rejection state | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-004 | authenticated user | approved adjustment posting and audit outcome | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-005 | authenticated user | adjustment approval, source, movement, and quantity effects | journey_workspace_create_and_operate |
| src/components/operations/operations-page.tsx | REQ-FUN-INVENTORY-ADJUSTMENT-006 | authenticated user | reversing adjustment correction state | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-001 | authenticated user | project workspace entry point | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-002 | authenticated user | project search report workspace | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-003 | authenticated user | project information state visibility | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-004 | authenticated user | project membership state visibility | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-005 | authenticated user | membership lifecycle visibility | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-006 | authenticated user | project archive state visibility | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-007 | authenticated user | project completion state visibility | journey_workspace_create_and_operate |
| src/components/people/people-page.tsx | REQ-FUN-PROJECT-008 | authenticated user | project cancellation state visibility | journey_workspace_create_and_operate |
| src/components/planning/planning-page.tsx | REQ-FUN-MRP-001 | authenticated user | manual planning report workspace | journey_workspace_create_and_operate |
| src/components/planning/planning-page.tsx | REQ-FUN-MRP-002 | authenticated user | scheduled planning status visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-001 | authenticated user | approval request state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-002 | authenticated user | approval inbox state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-003 | authenticated user | approval step state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-004 | authenticated user | rejection state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-005 | authenticated user | requester change state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-006 | authenticated user | delegation state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-007 | authenticated user | escalation state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-008 | authenticated user | fallback approver state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-009 | authenticated user | source approval state visibility | journey_workspace_create_and_operate |
| src/components/controls/controls-page.tsx | REQ-FUN-APPROVAL-010 | authenticated user | immutable approval history | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-001 | authenticated user | trial balance report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-002 | authenticated user | balance sheet report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-003 | authenticated user | profit and loss report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-004 | authenticated user | general ledger report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-005 | authenticated user | receivable aging report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-006 | authenticated user | payable aging report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-007 | authenticated user | cash flow report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-008 | authenticated user | tax summary report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-009 | authenticated user | budget actual report | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-010 | authenticated user | report filter controls | journey_workspace_create_and_operate |
| src/components/finance/reports-page.tsx | REQ-FUN-REPORT-FIN-011 | authenticated user | report export state visibility | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-001 | authenticated user | profile view | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-002 | authenticated user | profile update form | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-003 | authenticated user | password change state visibility | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-004 | authenticated user | account recovery state visibility | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-005 | authenticated user | account deactivation state visibility | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-006 | authenticated user | account reactivation state visibility | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-007 | authenticated user | active organization context | journey_workspace_create_and_operate |
| src/components/settings/settings-page.tsx | REQ-AUTH-ACCOUNT-008 | authenticated user | organization switching context | journey_workspace_create_and_operate |
| src/components/auth/login-page.tsx | REQ-AUTH-PRINCIPAL-001 | authenticated user | credential identity entry point | journey_workspace_create_and_operate |
| src/components/auth/login-page.tsx | REQ-AUTH-PRINCIPAL-002 | authenticated user | principal boundary explanation | journey_workspace_create_and_operate |
| src/components/auth/login-page.tsx | REQ-AUTH-PRINCIPAL-003 | authenticated user | system action context explanation | journey_workspace_create_and_operate |
| src/components/auth/login-page.tsx | REQ-AUTH-PRINCIPAL-004 | authenticated user | scoped action context explanation | journey_workspace_create_and_operate |
| src/components/overview/dashboard-page.tsx | REQ-DOM-ORG-001 | authenticated user | organization identity context | journey_workspace_create_and_operate |
| src/components/overview/dashboard-page.tsx | REQ-DOM-ORG-002 | authenticated user | organization-scoped workspace context | journey_workspace_create_and_operate |
| src/components/overview/dashboard-page.tsx | REQ-DOM-ORG-003 | authenticated user | organization history context | journey_workspace_create_and_operate |
