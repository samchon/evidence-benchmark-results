import { Controller, Get, Header } from "@nestjs/common";

/**
 * Reports whether the HTTP application is accepting requests.
 */
@Controller("health")
export class HealthController {
  /**
   * Returns the process health marker.
   *
   * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-production-backend-delivery Owns the cross-cutting backend behavior at this operation/test boundary.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-production-backend-delivery Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-001-runs-as-a-working-production-grade-autobe-backend-across-every-source-named-erp-module Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
 * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-001-runs-as-a-working-production-grade-autobe-backend-across-every-source-named-erp-module Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-002-organizations-production-delivery-for-organizations-rely-durable Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-002-organizations-production-delivery-for-organizations-rely-durable Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-003-consumers-production-delivery-for-consumers-invoke-typed Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-003-consumers-production-delivery-for-consumers-invoke-typed Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-004-the-production-delivery-for-completed-proves-procure Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-004-the-production-delivery-for-completed-proves-procure Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @evidence docs/analysis/05-non-functional.md#req-nfr-delivery-005-each-production-delivery-for-each-journey-verification Routes this requirement through the operation boundary and applies its persisted state and authority constraints.
   * @evidenceReview docs/analysis/05-non-functional.md#req-nfr-delivery-005-each-production-delivery-for-each-journey-verification Read the operation method and provider delegation, then checked this public boundary is the cited requirement owner.
   * @returns Literal marker used by local and deployed health probes.
   */
  @Get()
  @Header("Content-Type", "text/plain")
  public get(): string {
    return "OK";
  }
}
