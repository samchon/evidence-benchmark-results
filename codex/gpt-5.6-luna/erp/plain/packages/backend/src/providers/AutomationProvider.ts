import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { DepreciationProvider } from "./DepreciationProvider";
import { DocumentNumberService } from "./DocumentNumberService";
import { MrpProvider } from "./MrpProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Durable, tenant-scoped scheduled work and retry boundary. */
export namespace AutomationProvider {
  let scheduledRunning = false;

  export async function index(p: { actor: ErpPayload; input: api.IPage.IRequest }): Promise<api.IPage<api.IAutomationRun>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Finance Manager"], "Only an authorized finance operator may inspect automation runs.");
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId };
    const [rows, records] = await Promise.all([MyGlobal.prisma.automation_runs.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } }), MyGlobal.prisma.automation_runs.count({ where })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(dto) };
  }

  export async function retry(p: { actor: ErpPayload; id: string }): Promise<api.IAutomationRun> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Finance Manager"], "Only an authorized finance operator may retry automation.");
    const changed = await MyGlobal.prisma.automation_runs.updateMany({ where: { id: p.id, organization_id: organizationId, status: "failed" }, data: { status: "queued", error: null } });
    if (changed.count !== 1) throw ErrorUtil.conflict("Only a failed automation run can be retried.");
    return dto(await MyGlobal.prisma.automation_runs.findUniqueOrThrow({ where: { id: p.id } }));
  }

  export async function runScheduled(): Promise<void> {
    if (scheduledRunning) return;
    scheduledRunning = true;
    try {
      const organizations = await MyGlobal.prisma.organizations.findMany({ where: { status: "active", system_user_id: { not: null }, system_membership_id: { not: null } }, select: { id: true, system_user_id: true, system_membership_id: true } });
      const periodKey = new Date().toISOString().slice(0, 10);
      for (const organization of organizations) {
        if (organization.system_user_id === null || organization.system_membership_id === null) continue;
        const actor: ErpPayload = { id: organization.system_user_id, membership_id: organization.system_membership_id, session_id: `system-${organization.system_membership_id}` };
        for (const jobType of ["mrp", "depreciation", "rate_refresh", "numbering", "reminders", "dispatch"] as const) await execute(organization.id, organization.system_membership_id, actor, jobType, periodKey);
      }
    } finally {
      scheduledRunning = false;
    }
  }

  async function execute(organizationId: string, systemMembershipId: string, actor: ErpPayload, jobType: string, periodKey: string): Promise<void> {
    const now = new Date();
    const existing = await MyGlobal.prisma.automation_runs.findUnique({ where: { organization_id_job_type_period_key: { organization_id: organizationId, job_type: jobType, period_key: periodKey } } });
    if (existing?.status === "completed" || existing?.status === "running") return;
    let run: NonNullable<typeof existing>;
    try {
      run = existing === null ? await MyGlobal.prisma.automation_runs.create({ data: { id: randomUUID(), organization_id: organizationId, system_membership_id: systemMembershipId, job_type: jobType, period_key: periodKey, status: "running", trigger: "server-schedule", result: null, error: null, started_at: now, completed_at: null, created_at: now, attempts: 1 } }) : await MyGlobal.prisma.automation_runs.update({ where: { id: existing.id }, data: { status: "running", started_at: now, attempts: { increment: 1 }, error: null } });
    } catch {
      const winner = await MyGlobal.prisma.automation_runs.findUnique({ where: { organization_id_job_type_period_key: { organization_id: organizationId, job_type: jobType, period_key: periodKey } } });
      if (winner === null || winner.status === "completed" || winner.status === "running") return;
      run = await MyGlobal.prisma.automation_runs.update({ where: { id: winner.id }, data: { status: "running", started_at: now, attempts: { increment: 1 }, error: null } });
    }
    try {
      const result = await perform(organizationId, systemMembershipId, actor, jobType, periodKey);
      await MyGlobal.prisma.automation_runs.update({ where: { id: run.id }, data: { status: "completed", result, completed_at: new Date() } });
    } catch (error) {
      await MyGlobal.prisma.automation_runs.update({ where: { id: run.id }, data: { status: "failed", error: error instanceof Error ? error.message : String(error), completed_at: new Date() } });
    }
  }

  async function perform(organizationId: string, systemMembershipId: string, actor: ErpPayload, jobType: string, periodKey: string): Promise<string> {
    if (jobType === "mrp") { const from = new Date(); const to = new Date(from); to.setUTCDate(to.getUTCDate() + 30); const run = await MrpProvider.runCreate({ actor, body: { horizonFrom: from.toISOString(), horizonTo: to.toISOString(), triggerType: "scheduled" } }); return JSON.stringify({ runId: run.id, recommendationCount: run.summary.recommendationCount }); }
    if (jobType === "depreciation") { const schedules = await MyGlobal.prisma.depreciation_schedules.findMany({ where: { organization_id: organizationId, period: periodKey.slice(0, 7), status: "planned" }, select: { asset_id: true } }); if (schedules.length === 0) return JSON.stringify({ skipped: "no-planned-schedules" }); const run = await DepreciationProvider.runCreate({ actor, body: { period: periodKey.slice(0, 7), assetIds: schedules.map((row) => row.asset_id) } }); const posted = await DepreciationProvider.runPost({ actor, id: run.id }); return JSON.stringify({ runId: posted.id, status: posted.status }); }
    if (jobType === "rate_refresh") return JSON.stringify({ refreshed: await refreshRates(organizationId, periodKey) });
    if (jobType === "numbering") { await DocumentNumberService.next(organizationId, "automation_audit"); return JSON.stringify({ maintained: true }); }
    if (jobType === "reminders") return JSON.stringify({ queued: await queueReminders(organizationId, systemMembershipId, periodKey) });
    if (jobType === "dispatch") { return JSON.stringify({ dispatched: await dispatchQueued(organizationId) }); }
    return JSON.stringify({ maintained: true, jobType, periodKey });
  }

  async function refreshRates(organizationId: string, periodKey: string): Promise<number> {
    const organization = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } });
    const effectiveAt = new Date(`${periodKey}T00:00:00.000Z`);
    const currencies = await MyGlobal.prisma.currencies.findMany({ where: { organization_id: organizationId, active: true }, select: { code: true } });
    let refreshed = 0;
    for (const currency of currencies) {
      const sourceCurrency = organization.base_currency;
      const rate = currency.code === sourceCurrency ? 1 : (await MyGlobal.prisma.exchange_rates.findFirst({ where: { organization_id: organizationId, source_currency: sourceCurrency, target_currency: currency.code, effective_at: { lte: effectiveAt } }, orderBy: { effective_at: "desc" }, select: { rate: true } }))?.rate;
      if (rate === undefined) continue;
      await MyGlobal.prisma.exchange_rates.upsert({ where: { organization_id_source_currency_target_currency_effective_at: { organization_id: organizationId, source_currency: sourceCurrency, target_currency: currency.code, effective_at: effectiveAt } }, create: { id: randomUUID(), organization_id: organizationId, source_currency: sourceCurrency, target_currency: currency.code, effective_at: effectiveAt, rate, origin: "system-refresh", created_at: new Date() }, update: { rate, origin: "system-refresh" } });
      refreshed += 1;
    }
    return refreshed;
  }

  async function queueReminders(organizationId: string, systemMembershipId: string, periodKey: string): Promise<number> {
    const roles = await MyGlobal.prisma.roles.findMany({ where: { organization_id: organizationId, name: { in: ["Owner", "Finance Manager", "Procurement Manager", "Production Manager"] }, active: true }, select: { id: true } });
    const assignments = await MyGlobal.prisma.role_assignments.findMany({ where: { role_id: { in: roles.map((role) => role.id) } }, select: { membership_id: true } });
    const activeMembers = await MyGlobal.prisma.memberships.findMany({ where: { organization_id: organizationId, status: "active", id: { not: systemMembershipId } }, select: { id: true } });
    const activeIds = new Set(activeMembers.map((member) => member.id));
    const managers = new Set(assignments.map((assignment) => assignment.membership_id).filter((id) => activeIds.has(id)));
    const pending = await MyGlobal.prisma.approvals.findMany({ where: { organization_id: organizationId, status: "pending", created_at: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, select: { id: true, target_type: true, target_id: true, requester_membership_id: true, assigned_membership_id: true } });
    let queued = 0;
    const day = new Date(`${periodKey}T00:00:00.000Z`); const isPeriodEnd = day.getUTCDate() === new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth() + 1, 0)).getUTCDate();
    if (isPeriodEnd) for (const membershipId of managers) if (await queueNotification(organizationId, membershipId, "period-end-reminder", { periodKey, systemMembershipId }, null)) queued += 1;
    for (const approval of pending) {
      const recipients = new Set(managers);
      if (activeIds.has(approval.requester_membership_id)) recipients.add(approval.requester_membership_id);
      if (approval.assigned_membership_id !== null && activeIds.has(approval.assigned_membership_id)) recipients.add(approval.assigned_membership_id);
      for (const membershipId of recipients) if (await queueNotification(organizationId, membershipId, "approval-escalation", { approvalId: approval.id, targetType: approval.target_type, targetId: approval.target_id, systemMembershipId }, approval.id)) queued += 1;
    }
    return queued;
  }

  async function queueNotification(organizationId: string, membershipId: string, kind: string, payload: Record<string, unknown>, sourceId: string | null): Promise<boolean> {
    const value = JSON.stringify(payload);
    return MyGlobal.prisma.$transaction(async (tx) => {
      await tx.organizations.update({ where: { id: organizationId }, data: { updated_at: new Date() } });
      if (await tx.notifications.findFirst({ where: sourceId === null ? { organization_id: organizationId, membership_id: membershipId, kind, payload: value } : { organization_id: organizationId, membership_id: membershipId, kind, source_id: sourceId } }) !== null) return false;
      await tx.notifications.create({ data: { id: randomUUID(), organization_id: organizationId, membership_id: membershipId, source_id: sourceId, kind, channel: "in_app", payload: value, status: "queued", attempts: 0, created_at: new Date(), sent_at: null, last_error: null } });
      return true;
    });
  }

  async function dispatchQueued(organizationId: string): Promise<number> {
    const rows = await MyGlobal.prisma.notifications.findMany({ where: { organization_id: organizationId, status: "queued" }, orderBy: { created_at: "asc" } });
    let dispatched = 0;
    for (const row of rows) {
      try {
        if (row.channel !== "in_app" && row.channel !== "email") throw ErrorUtil.unprocessable("The notification channel is not supported.");
        const changed = await MyGlobal.prisma.notifications.updateMany({ where: { id: row.id, organization_id: organizationId, status: "queued" }, data: { status: "sent", sent_at: new Date(), attempts: { increment: 1 }, last_error: null } });
        dispatched += changed.count;
      } catch (error) {
        await MyGlobal.prisma.notifications.updateMany({ where: { id: row.id, organization_id: organizationId, status: "queued" }, data: { status: "failed", attempts: { increment: 1 }, last_error: error instanceof Error ? error.message : String(error) } });
      }
    }
    return dispatched;
  }

  function dto(row: { id: string; organization_id: string; system_membership_id: string; job_type: string; period_key: string; status: string; trigger: string; result: string | null; error: string | null; started_at: Date; completed_at: Date | null; attempts: number }): api.IAutomationRun { return { id: row.id, organizationId: row.organization_id, systemMembershipId: row.system_membership_id, jobType: row.job_type, periodKey: row.period_key, status: row.status as api.IAutomationRun["status"], trigger: row.trigger, result: row.result, error: row.error, startedAt: row.started_at.toISOString(), completedAt: row.completed_at?.toISOString() ?? null, attempts: row.attempts }; }
}
