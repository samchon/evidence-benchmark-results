# Frontend screen plan

The first implementation covers the authenticated customer, seller, and administrator journeys required by `docs/analysis`.

| Route | Audience | Required states and interactions |
| --- | --- | --- |
| `/` | all | landing, sign-in/register links, responsive shell |
| `/auth` | all | customer/seller login and registration, validation, error and success states |
| `/shop` | customer | product search, category filter, product detail, wishlist and cart actions |
| `/cart` | customer | quantity edits, removal, checkout entry, empty/loading/error states |
| `/checkout` | customer | address selection, payment form, success/failure result |
| `/orders` | customer | order list/detail, shipment tracking, cancellation/refund, review entry |
| `/account` | customer | profile, addresses, password, session and account closure controls |
| `/seller` | seller | approval/dashboard, catalog, inventory, fulfillment and requests |
| `/admin` | administrator | users, seller approvals, products, orders, applications and grade controls |

Every route is reachable from the shell navigation. Protected routes render restoring, anonymous, and authenticated states instead of exposing data to anonymous visitors.
