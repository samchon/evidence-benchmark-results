# Product-facing operation coverage

Every generated accessor is consumed by `useRunPublishedOperation` and is
reachable from the Published operations screen. Domain list screens provide
the primary module workspaces; the command runner supplies the remaining
workflow and infrastructure commands without inventing a second transport
layer. Health checks and token refresh remain workflow-owned and do not need
standalone pages.

The invalidating condition for this omission record is any requirement that
needs a dedicated multi-step form, field-level validation, or a domain-specific
journey beyond the generic typed command runner. That requirement must gain a
purpose-built screen and journey before this record can be shortened.
