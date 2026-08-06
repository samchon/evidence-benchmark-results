# Frontend screen plan

The static SPA is organized around the four actor-facing workspaces and one
operational surface. Every page owns loading, refusal, empty, retry, and
success messaging while hooks own generated-SDK calls.

| Screen | Route | Requirement coverage | Hooks |
| --- | --- | --- | --- |
| Home | `/` | product discovery and entry points | catalog, customer, seller, admin, system |
| Customer | `/customer` | identity, profile, addresses, cart, checkout, orders, reviews | customer, catalog |
| Seller | `/seller` | seller lifecycle, catalog, inventory, fulfillment, requests | seller, catalog |
| Administrator | `/admin` | governance, moderation, categories, orders, dispute resolution | admin |
| Operations | `/operations` | health, tracking, automation | system |

The existing Playwright scaffold and responsive review continue to exercise the
home page. Journey tests link to these exported page functions and walk the
same routes a user sees.
