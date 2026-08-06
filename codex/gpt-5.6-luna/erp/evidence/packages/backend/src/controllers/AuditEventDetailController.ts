
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IAuth, IAuditEvent } from "@benchmark/erp-api"; import { ObservabilityProvider } from "../providers/ObservabilityProvider";


 @Controller("audit-event-detail") export class AuditEventDetailController {
/** Retrieves one immutable audit event with before/after values and reason.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-audit-history-operations Covers audit-history operations.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-audit-003-views-one-events-before-and-after-values-reason-ip-address-user-agent-timestamp Exposes before/after values, reason, actor, and timestamp.
 * @evidence prisma:audit_events Exposes the persisted audit_events record through this operation.
*/
  @core.TypedRoute.Get(":id")
  public async at(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string):Promise<IAuditEvent>{return ObservabilityProvider.auditDetail(h,id);} }
