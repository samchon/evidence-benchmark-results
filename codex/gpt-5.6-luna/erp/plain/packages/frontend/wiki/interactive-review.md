# Interactive review

Date: 2026-08-11

The browser review uses a live backend and verifies the invitation-based entry boundary, selected organization context, lifecycle controls, and authenticated route surfaces.

| Surface | Interaction exercised | Result |
| --- | --- | --- |
| Login | Opened sign-in and submitted an existing invitation-issued account | Context selection is required after authentication |
| Invitation | Submitted an invalid token, email, identity, and password; accepted a separately prepared active delivery | Invalid proof renders an actionable refusal; valid proof establishes a membership and reaches organization selection |
| Organization context | Selected and switched active memberships | Operational context changes through the generated selection command |
| Public entry refusal | Opened `/onboarding` directly | The public self-registration route is absent |
| Accounts | Created, edited, and deactivated an account | Lifecycle actions remain visible in the chart table |
| Journals | Created, edited, posted, and corrected a journal | Draft and immutable-posted controls are distinct |
| Reports | Selected report kinds, applied date and source-named dimension filters, and requested export | The selected filter set is preserved by the report query and export |
| Operations | Inspected stock, sales, purchasing, and generated operation boundary | Loading, failure, empty, and the 430-accessor hook catalog states are visible |
| People & projects | Inspected people, contracts, and timesheet signals | Loading, failure, and empty states are visible |
| Controls | Resolved a prepared approval, opened its history, and inspected the audit trail | The decision outcome and immutable approval history are visible; resolved approvals no longer expose decision actions |
| Planning | Inspected MRP, production, quality, and maintenance signals | Loading, failure, and empty states are visible |
| Settings | Updated the profile and revisited the page to verify persistence; inspected organization, invitation, credential, recovery, and session forms | Profile persistence is verified; other sensitive actions expose explicit forms and visible outcomes |

Final browser review: rerun against the current production preview on 2026-08-11 after the final gates. Login loaded at desktop preview width with no console errors after the existing SVG favicon was linked; the three automated responsive checks covered 390, 834, and 1440 pixel widths.
