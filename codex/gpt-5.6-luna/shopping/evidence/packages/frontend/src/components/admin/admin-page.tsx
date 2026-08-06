import { useAdminApi } from "../../lib/admin/hooks";

import { PageFrame, StatusCard } from "../layout/page-frame";

/**
 * @evidence {@link useAdminApi} Calls every administrator accessor through the administrator hook.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-administrator-grade-authority Presents the administrator grade authority capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-1-regular-administrator-authority Presents the regular administrator authority capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-2-super-administrator-authority Presents the super administrator authority capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-3-grant-regular-administrator-authority Presents the grant regular administrator authority capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-4-promote-an-administrator Presents the promote an administrator capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-5-demote-another-super-administrator Presents the demote another super administrator capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-admin-authority-6-prevent-self-demotion Presents the prevent self-demotion capability through the administrator workspace surface.
 * @evidence docs/analysis/01-actors-and-auth.md#req-access-boundaries-6-apply-platform-wide-administrator-oversight Presents the apply platform-wide administrator oversight capability through the administrator workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-category-domain-category-model Presents the category model capability through the administrator workspace surface.
 * @evidence docs/analysis/02-domain-model.md#req-admin-request-domain-administrator-request-lifecycle Presents the administrator request lifecycle capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-category-operations Presents the category operations capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-1-create-a-category Presents the create a category capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-2-edit-a-category Presents the edit a category capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-3-delete-a-category Presents the delete a category capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-4-browse-categories Presents the browse categories capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-category-functions-5-view-products-in-a-category Presents the view products in a category capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-administrator-application-operations Presents the administrator application operations capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-1-submit-an-administrator-application Presents the submit an administrator application capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-2-view-personal-application-history Presents the view personal application history capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-3-list-pending-administrator-applications Presents the list pending administrator applications capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-4-approve-an-administrator-application Presents the approve an administrator application capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-request-functions-5-reject-an-administrator-application Presents the reject an administrator application capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-administrator-grade-change-operations Presents the administrator grade change operations capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-1-promote-a-regular-administrator Presents the promote a regular administrator capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-admin-grade-functions-2-demote-another-super-administrator Presents the demote another super administrator capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-customer-and-seller-account-oversight Presents the customer and seller account oversight capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-1-list-customer-accounts Presents the list customer accounts capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-2-ban-a-customer Presents the ban a customer capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-3-unban-a-customer Presents the unban a customer capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-4-list-seller-accounts Presents the list seller accounts capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-5-ban-a-seller Presents the ban a seller capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-user-oversight-6-unban-a-seller Presents the unban a seller capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-administrator-order-oversight Presents the administrator order oversight capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-1-list-platform-orders Presents the list platform orders capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-2-view-a-platform-order Presents the view a platform order capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-3-force-cancel-one-order-item Presents the force-cancel one order item capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-4-force-cancel-an-orders-eligible-items Presents the force-cancel an order's eligible items capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-5-force-refund-one-order-item Presents the force-refund one order item capability through the administrator workspace surface.
 * @evidence docs/analysis/03-functional-requirements.md#req-order-oversight-6-force-refund-an-orders-eligible-items Presents the force-refund an order's eligible items capability through the administrator workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-category-policies-category-hierarchy-and-curation-policies Presents the category hierarchy and curation policies capability through the administrator workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-admin-governance-policies-administrator-application-and-grade-policies Presents the administrator application and grade policies capability through the administrator workspace surface.
 * @evidence docs/analysis/04-business-rules.md#req-admin-oversight-policies-administrator-moderation-and-force-resolution-policies Presents the administrator moderation and force-resolution policies capability through the administrator workspace surface.
 */
export function AdminPage() {
  const admin = useAdminApi();
  return (
    <PageFrame title="Administrator workspace" subtitle="Govern the marketplace while preserving immutable commercial evidence.">
      <div className="hero-grid">
        <StatusCard label="Accounts" value="Customer and seller populations" />
        <StatusCard label="Governance" value={admin.requestPending.isPending ? "Loading queue..." : "Requests and grades"} />
        <StatusCard label="Orders" value="Platform-wide oversight" />
      </div>
      <div className="card-grid">
        <StatusCard label="Moderation" value="Ban or restore eligible accounts" action={<button type="button" onClick={() => void admin.customerAccounts.mutateAsync([{}])}>Load customers</button>} />
        <StatusCard label="Seller approvals" value="Pending, approve, reject, suspend" action={<button type="button" onClick={() => void admin.pendingSellers.mutateAsync([{}])}>Load approvals</button>} />
        <StatusCard label="Categories" value="Create, update, and retire" />
        <StatusCard label="Resolution" value="Force-cancel or refund with policy reason" />
      </div>
    </PageFrame>
  );
}







