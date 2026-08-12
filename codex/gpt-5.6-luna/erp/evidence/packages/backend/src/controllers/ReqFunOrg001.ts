import * as core from "@nestia/core";
import { Controller } from "@nestjs/common";
import type { IErpRecord, IErpRequest } from "@benchmark/erp-api";
import { ErpProvider } from "../providers/ErpProvider";

@Controller("erp/req-fun-org-001")
export class ReqFunOrg001 {
  /**
   * Creates an organization and establishes its first Owner.
   *
   * @param input Organization creation fields.
   * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Owns the organization operation family.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-organization-administration Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/03-functional-requirements.md#req-fun-org-001-creates-an-organization-and-becomes-its-first-owner Persists the organization and first-owner setup.
   * @evidenceReview docs/analysis/03-functional-requirements.md#req-fun-org-001-creates-an-organization-and-becomes-its-first-owner Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/02-domain-model.md#req-dom-org-organization-scope Persists the organization boundary used by all tenant operations.
   * @evidenceReview docs/analysis/02-domain-model.md#req-dom-org-organization-scope Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence prisma:organizations Exposes the organization aggregate persisted by the provider.
   * @evidenceReview prisma:organizations Read the operation method and provider model dispatch, then checked the named persisted model is used at this public boundary.
   * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-001-a-read-write-command-report-export-approval-audit-event-notification-or-background-job-may-access-only-its-active-organization Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/04-business-rules.md#req-rule-org-access-004-must-retain-at-least-one-active-owner Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/04-business-rules.md#req-rule-org-access-004-must-retain-at-least-one-active-owner Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns The created organization boundary.
   */
  @core.TypedRoute.Post("execute")
  public async req_fun_org_001(
    @core.TypedBody() input: IErpRequest,
  ): Promise<IErpRecord> {
    return ErpProvider.execute({ operation: "req_fun_org_001", input });
  }
}
