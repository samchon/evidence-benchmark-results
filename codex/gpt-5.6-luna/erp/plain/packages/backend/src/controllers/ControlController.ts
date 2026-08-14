import type * as api from "@benchmark/erp-api";
import * as core from "@nestia/core";
import { Controller, UseGuards } from "@nestjs/common";
import { ErpAuth, ErpAuthGuard, type ErpPayload } from "../decorators/ErpAuth";
import { ControlProvider } from "../providers/ControlProvider";
import { tags } from "typia";

/** Audit and cross-module report reads. */
@Controller("erp/control")
@UseGuards(ErpAuthGuard)
export class ControlController {
  /** Lists immutable audit events in the active organization. @tag Audit */
  @core.TypedRoute.Patch("audit")
  public async auditIndex(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IAuditEvent.IRequest): Promise<api.IPage<api.IAuditEvent>> { return ControlProvider.auditIndex({ actor, input }); }
  /** Reads one immutable audit event. @tag Audit */
  @core.TypedRoute.Get("audit/:id")
  public async auditAt(@ErpAuth() actor: ErpPayload, @core.TypedParam("id") id: string & tags.Format<"uuid">): Promise<api.IAuditEvent> { return ControlProvider.auditAt({ actor, id }); }
  /** Generates a scoped report from posted journals or immutable stock movements. @tag Reporting */
  @core.TypedRoute.Post("report")
  public async report(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IReport.IRequest): Promise<api.IReport> { return ControlProvider.report({ actor, input }); }

  /** Exports the same organization-scoped report projection and filters. @tag Reporting */
  @core.TypedRoute.Post("report/export")
  public async reportExport(@ErpAuth() actor: ErpPayload, @core.TypedBody() input: api.IReport.IRequest): Promise<api.IReport> { return ControlProvider.report({ actor, input }); }
}
