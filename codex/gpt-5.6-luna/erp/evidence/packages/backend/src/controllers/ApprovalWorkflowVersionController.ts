
import * as core from "@nestia/core"; import { Controller } from "@nestjs/common"; import type { IApprovalWorkflow, IAuth } from "@benchmark/erp-api"; import { ApprovalProvider as P } from "../providers/ApprovalProvider";


 @Controller("approval-workflow-version") export class ApprovalWorkflowVersionController { /** Creates a draft version from an active approval workflow.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-workflow-006-creates-a-new-version-of-an-active-workflow Creates a new version from an active workflow.
 */
  @core.TypedRoute.Post(":id")
  public async version(@core.TypedHeaders() h:IAuth.IHeaders,@core.TypedParam("id") id:string,@core.TypedBody() i:IApprovalWorkflow.IVersion):Promise<IApprovalWorkflow>{return P.workflowVersion(h,id,i);} }
