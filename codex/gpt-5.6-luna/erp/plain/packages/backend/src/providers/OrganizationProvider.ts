import type { IOrganization, IPage } from "@benchmark/erp-api";
import crypto from "node:crypto";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { PaginationUtil } from "../utils/PaginationUtil";
import type { SessionPayload } from "./AuthProvider";

export namespace OrganizationProvider {
  const builtInPermissions: Record<string, string[]> = {
    Owner: ["*"],
    "Finance Manager": ["finance:*", "report:read", "audit:read"],
    "Procurement Manager": ["procurement:*", "vendor:read", "item:read", "report:read"],
    "Sales Manager": ["sales:*", "customer:read", "item:read", "report:read"],
    "Warehouse Manager": ["warehouse:*", "inventory:*", "item:read", "report:read"],
    "HR Manager": ["hr:*", "payroll:read", "report:read"],
    "Production Manager": ["manufacturing:*", "quality:read", "item:read", "report:read"],
    Employee: ["profile:read", "organization:read", "self:write"],
  };

  export async function create(p: { body: IOrganization.ICreate; userId: string }): Promise<IOrganization> {
    const now = new Date();
    const result = await MyGlobal.prisma.$transaction(async (tx: any) => {
      const organization = await tx.organizations.create({
        data: {
          id: crypto.randomUUID(), name: p.body.name, code: p.body.code,
          status: "active", base_currency_code: p.body.baseCurrencyCode ?? "USD",
          created_by_user_id: p.userId, created_at: now, updated_at: now,
        },
      });
      const membership = await tx.memberships.create({
        data: { id: crypto.randomUUID(), user_id: p.userId, organization_id: organization.id, status: "active", created_at: now, updated_at: now },
      });
      for (const key of ["Owner", "Finance Manager", "Procurement Manager", "Sales Manager", "Warehouse Manager", "HR Manager", "Production Manager", "Employee"]) {
        const role = await tx.roles.create({
          data: { id: crypto.randomUUID(), organization_id: organization.id, key, name: key, built_in: true, permissions: JSON.stringify(builtInPermissions[key] ?? []), created_at: now },
        });
        if (key === "Owner" || key === "Employee") {
          await tx.membership_roles.create({ data: { id: crypto.randomUUID(), membership_id: membership.id, role_id: role.id, created_at: now } });
        }
      }
      await tx.system_principals.create({ data: { id: crypto.randomUUID(), organization_id: organization.id, name: `System@${organization.code}`, created_at: now } });
      return organization;
    });
    return dto(result);
  }

  export async function list(p: { userId: string; input: IOrganization.IRequest }): Promise<IPage<IOrganization>> {
    const search = p.input.search?.trim();
    const where: any = { status: "active", memberships: { some: { user_id: p.userId, status: "active" } }, ...(search ? { OR: [{ name: { contains: search } }, { code: { contains: search } }] } : {}) };
    const { limit, current } = PaginationUtil.page(p.input);
    const [records, rows] = await Promise.all([
      MyGlobal.prisma.organizations.count({ where }),
      MyGlobal.prisma.organizations.findMany({ where, skip: (current - 1) * limit, take: limit === 0 ? undefined : limit, orderBy: { created_at: "asc" } }),
    ]);
    return { data: rows.map(dto), pagination: { current, limit, records, pages: limit === 0 ? 1 : Math.ceil(records / limit) } };
  }

  export async function at(p: { session: SessionPayload }): Promise<IOrganization> {
    if (!p.session.organizationId) throw ErrorUtil.forbidden("Select an active organization first.");
    const row = await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: p.session.organizationId } });
    return dto(row);
  }

  export async function update(p: { session: SessionPayload; body: IOrganization.IUpdate }): Promise<IOrganization> {
    const organizationId = await owner(p.session);
    return dto(await MyGlobal.prisma.organizations.update({ where: { id: organizationId }, data: { name: p.body.name ?? undefined, base_currency_code: p.body.baseCurrencyCode ?? undefined, updated_at: new Date() } }));
  }

  export async function erase(p: { session: SessionPayload }): Promise<{ success: true }> {
    const organizationId = await owner(p.session);
    const [pendingApprovals, activeEmployees, postedJournals, stockMovements] = await Promise.all([
      MyGlobal.prisma.approval_requests.count({ where: { organization_id: organizationId, status: { in: ["pending", "active", "submitted"] } } }),
      MyGlobal.prisma.employees.count({ where: { organization_id: organizationId, status: { in: ["active", "on_leave"] } } }),
      MyGlobal.prisma.journal_entries.count({ where: { organization_id: organizationId, status: "posted" } }),
      MyGlobal.prisma.stock_movements.count({ where: { organization_id: organizationId } }),
    ]);
    const blockers = [
      pendingApprovals > 0 ? `${pendingApprovals} pending approval(s)` : undefined,
      activeEmployees > 0 ? `${activeEmployees} active employee(s)` : undefined,
      postedJournals > 0 ? `${postedJournals} posted journal(s)` : undefined,
      stockMovements > 0 ? `${stockMovements} stock movement(s)` : undefined,
    ].filter((value): value is string => value !== undefined);
    if (blockers.length > 0) throw ErrorUtil.conflict(`Organization cannot be deleted while it has ${blockers.join(", ")}.`);
    await MyGlobal.prisma.$transaction(async (tx: any) => {
      await tx.audit_events.create({ data: { id: crypto.randomUUID(), organization_id: organizationId, actor_user_id: p.session.userId, action: "organization.delete", target_type: "organization", target_id: organizationId, risk_level: "high", reason: "Owner requested organization deletion", before_json: JSON.stringify({ status: "active" }), after_json: JSON.stringify({ status: "deleted" }), created_at: new Date() } });
      await tx.organizations.update({ where: { id: organizationId }, data: { status: "deleted", updated_at: new Date() } });
    });
    return { success: true };
  }

  async function owner(session: SessionPayload): Promise<string> {
    if (!session.organizationId) throw ErrorUtil.forbidden("Select an active organization first.");
    const membership = await MyGlobal.prisma.memberships.findUnique({ where: { user_id_organization_id: { user_id: session.userId, organization_id: session.organizationId } }, include: { roles: { include: { role: true } } } });
    if (membership?.status !== "active" || !membership.roles.some((entry: any) => entry.role.key === "Owner")) throw ErrorUtil.forbidden("Only an Owner may change organization configuration.");
    return session.organizationId;
  }

  function dto(row: any): IOrganization {
    return { id: row.id, name: row.name, code: row.code, status: row.status, baseCurrencyCode: row.base_currency_code, owner: { id: row.created_by_user_id }, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() };
  }
}
