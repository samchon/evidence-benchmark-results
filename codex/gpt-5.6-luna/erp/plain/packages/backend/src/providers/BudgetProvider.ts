import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Immutable budget versions and activation. */
export namespace BudgetProvider {
  export async function create(p: { actor: ErpPayload; body: api.IBudget.ICreate }): Promise<api.IBudget> { const org = await AuthProvider.organizationId(p.actor); const latest = await MyGlobal.prisma.budgets.findFirst({ where: { organization_id: org, name: p.body.name }, orderBy: { version: "desc" } }); return budget(await MyGlobal.prisma.budgets.create({ data: { id: randomUUID(), organization_id: org, name: p.body.name, version: (latest?.version ?? 0) + 1, status: "draft", created_at: new Date() } })); }
  export async function index(p: { actor: ErpPayload; input: api.IPage.IRequest }): Promise<api.IPage<api.IBudget>> { const org = await AuthProvider.organizationId(p.actor); const page = p.input.page ?? 1; const limit = p.input.limit ?? 100; const where = { organization_id: org }; const [records, rows] = await Promise.all([MyGlobal.prisma.budgets.count({ where }), MyGlobal.prisma.budgets.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } })]); return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(budget) }; }
  export async function activate(p: { actor: ErpPayload; id: string }): Promise<api.IBudget> { const org = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.budgets.findFirst({ where: { id: p.id, organization_id: org, status: "draft" } }); if (row === null) throw ErrorUtil.conflict("Only a draft budget can be activated."); await MyGlobal.prisma.$transaction(async (tx) => { await tx.budgets.updateMany({ where: { organization_id: org, name: row.name, status: "active" }, data: { status: "superseded" } }); await tx.budgets.update({ where: { id: row.id }, data: { status: "active" } }); }); return budget(await MyGlobal.prisma.budgets.findUniqueOrThrow({ where: { id: row.id } })); }
  export async function close(p: { actor: ErpPayload; id: string }): Promise<api.IBudget> { const org = await AuthProvider.organizationId(p.actor); const row = await MyGlobal.prisma.budgets.findFirst({ where: { id: p.id, organization_id: org, status: "active" } }); if (row === null) throw ErrorUtil.conflict("Only an active budget can be closed."); return budget(await MyGlobal.prisma.budgets.update({ where: { id: row.id }, data: { status: "closed" } })); }
  function budget(row: { id: string; name: string; version: number; status: string }): api.IBudget { return { id: row.id, name: row.name, version: row.version, status: row.status as api.IBudget["status"] }; }
}
