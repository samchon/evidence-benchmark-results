import { randomUUID } from "node:crypto";

import type { IAuth, IOrganization, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns tenant bootstrap, membership-scoped discovery, and Owner settings. */
export namespace OrganizationProvider {
  /** Create a tenant and its first Owner atomically. */
  export async function create(props: { input: IOrganization.ICreate }): Promise<IOrganization> {
    const now = new Date();
    const existingUser = await MyGlobal.prisma.users.findUnique({ where: { email: props.input.ownerEmail.toLowerCase() } });
    if (existingUser !== null) throw ErrorUtil.conflict("The owner email is already registered.");
    const organization = await MyGlobal.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          id: randomUUID(),
          email: props.input.ownerEmail.toLowerCase(),
          password_hash: AuthProvider.hashCredential(props.input.ownerPassword),
          display_name: props.input.ownerDisplayName,
          avatar: null,
          phone: null,
          locale: "en-US",
          timezone: props.input.timezone,
          active: true,
          created_at: now,
          updated_at: now,
        },
      });
      const created = await tx.organizations.create({
        data: {
          id: randomUUID(),
          name: props.input.name,
          code: props.input.code.toLowerCase(),
          status: "active",
          created_by_user_id: user.id,
          base_currency: props.input.baseCurrency.toUpperCase(),
          timezone: props.input.timezone,
          fiscal_start_month: props.input.fiscalStartMonth,
          default_tax_jurisdiction: null,
          default_payment_term: null,
          negative_stock_policy: "allow",
          approval_threshold: 0,
          numbering_prefix: "DOC",
          active: true,
          created_at: now,
          updated_at: now,
        },
      });
      const membership = await tx.memberships.create({
        data: { id: randomUUID(), user_id: user.id, organization_id: created.id, status: "active", baseline_role: "Owner", created_at: now, updated_at: now },
      });
      const role = await tx.roles.create({
        data: { id: randomUUID(), organization_id: created.id, name: "Owner", built_in: true, created_at: now, updated_at: now },
      });
      const ownerPermissions = ["employee.self_service", "finance.manage", "procurement.manage", "sales.manage", "warehouse.manage", "hr.manage", "production.manage"];
      await tx.role_permissions.createMany({ data: ownerPermissions.map((permission) => ({ id: randomUUID(), role_id: role.id, permission, created_at: now })) });
      await tx.membership_roles.create({ data: { id: randomUUID(), membership_id: membership.id, role_id: role.id, created_at: now } });
      for (const [name, permissions] of [["Employee", ["employee.self_service"]], ["Finance Manager", ["employee.self_service", "finance.manage"]], ["Procurement Manager", ["employee.self_service", "procurement.manage"]], ["Sales Manager", ["employee.self_service", "sales.manage"]], ["Warehouse Manager", ["employee.self_service", "warehouse.manage"]], ["HR Manager", ["employee.self_service", "hr.manage"]], ["Production Manager", ["employee.self_service", "production.manage"]]] as const) {
        const seededRole = await tx.roles.create({ data: { id: randomUUID(), organization_id: created.id, name, built_in: true, created_at: now, updated_at: now } });
        await tx.role_permissions.createMany({ data: permissions.map((permission) => ({ id: randomUUID(), role_id: seededRole.id, permission, created_at: now })) });
      }
      for (const [code, name, accountType] of [["1000", "Assets", "asset"], ["2000", "Liabilities", "liability"], ["3000", "Equity", "equity"], ["4000", "Revenue", "revenue"], ["5000", "Expenses", "expense"]] as const) {
        await tx.accounts.create({ data: { id: randomUUID(), organization_id: created.id, code, name, account_type: accountType, parent_id: null, currency_id: null, description: "Seeded chart category", active: true, created_at: now, updated_at: now } });
      }
      await tx.system_principals.create({ data: { id: randomUUID(), organization_id: created.id, name: `${created.name} System`, created_at: now } });
      await tx.audit_events.create({
        data: { id: randomUUID(), organization_id: created.id, user_id: user.id, system_principal_id: null, action: "organization.create", target_type: "organization", target_id: created.id, before_value: null, after_value: created.name, reason: null, created_at: now },
      });
      return created;
    });
    return transform(organization);
  }

  /** List active organizations available to a signed-in user. */
  export async function index(props: { headers: IAuth.IHeaders; input: IOrganization.IRequest }): Promise<IPage<IOrganization>> {
    const actor = await AuthProvider.authorize(props.headers);
    const page = props.input.page ?? 1;
    const limit = props.input.limit ?? 100;
    const where: Prisma.organizationsWhereInput = { active: true, memberships: { some: { user_id: actor.id, status: "active" } }, ...(props.input.search ? { name: { contains: props.input.search } } : {}) };
    const [total, data] = await Promise.all([
      MyGlobal.prisma.organizations.count({ where }),
      MyGlobal.prisma.organizations.findMany({ where, orderBy: { name: "asc" }, ...(limit === 0 ? {} : { skip: (page - 1) * limit, take: limit }) }),
    ]);
    return { pagination: { current: page, limit, records: total, pages: limit === 0 ? 1 : Math.ceil(total / limit) }, data: data.map(transform) };
  }

  /** Read one organization visible through the current user's membership. */
  export async function at(props: { headers: IAuth.IHeaders; id: string }): Promise<IOrganization> {
    const actor = await AuthProvider.authorize(props.headers);
    const record = await MyGlobal.prisma.organizations.findFirst({ where: { id: props.id, active: true, memberships: { some: { user_id: actor.id, status: "active" } } } });
    if (record === null) throw ErrorUtil.notFound("No visible organization has this identifier.");
    return transform(record);
  }

  /** Update settings for an organization owned by the current user. */
  export async function update(props: { headers: IAuth.IHeaders; id: string; input: IOrganization.IUpdate }): Promise<IOrganization> {
    const actor = await AuthProvider.authorize(props.headers);
    const owner = await MyGlobal.prisma.memberships.findFirst({ where: { organization_id: props.id, user_id: actor.id, status: "active", baseline_role: "Owner" } });
    if (owner === null) throw ErrorUtil.forbidden("Only an Owner may update organization settings.");
    const record = await MyGlobal.prisma.organizations.findUnique({ where: { id: props.id } });
    if (record === null) throw ErrorUtil.notFound("No organization has this identifier.");
    const updated = await MyGlobal.prisma.organizations.update({ where: { id: props.id }, data: {
      ...(props.input.name !== undefined && props.input.name !== null ? { name: props.input.name } : {}),
      ...(props.input.timezone !== undefined && props.input.timezone !== null ? { timezone: props.input.timezone } : {}),
      ...(props.input.fiscalStartMonth !== undefined && props.input.fiscalStartMonth !== null ? { fiscal_start_month: props.input.fiscalStartMonth } : {}),
      ...(props.input.defaultTaxJurisdiction !== undefined ? { default_tax_jurisdiction: props.input.defaultTaxJurisdiction } : {}),
      ...(props.input.defaultPaymentTerm !== undefined ? { default_payment_term: props.input.defaultPaymentTerm } : {}),
      ...(props.input.negativeStockPolicy !== undefined && props.input.negativeStockPolicy !== null ? { negative_stock_policy: props.input.negativeStockPolicy } : {}),
      ...(props.input.approvalThreshold !== undefined && props.input.approvalThreshold !== null ? { approval_threshold: props.input.approvalThreshold } : {}),
      ...(props.input.numberingPrefix !== undefined && props.input.numberingPrefix !== null ? { numbering_prefix: props.input.numberingPrefix } : {}),
      updated_at: new Date(),
    } });
    return transform(updated);
  }

  /** Explain whether an Owner may retire an organization while retaining history. */
  export async function deleteCheck(props: { headers: IAuth.IHeaders; id: string }): Promise<IOrganization.IDeleteCheck> {
    const actor = await AuthProvider.authorize(props.headers);
    await ownerEnsure(props.id, actor.id);
    const [journals, movements, payroll, openApprovals] = await Promise.all([
      MyGlobal.prisma.journal_entries.count({ where: { organization_id: props.id, status: "posted" } }),
      MyGlobal.prisma.stock_movements.count({ where: { organization_id: props.id } }),
      MyGlobal.prisma.payroll_runs.count({ where: { organization_id: props.id, status: "posted" } }),
      MyGlobal.prisma.approval_requests.count({ where: { organization_id: props.id, status: "pending" } }),
    ]);
    const blockers: string[] = [];
    if (journals > 0) blockers.push("posted_journals");
    if (movements > 0) blockers.push("stock_movements");
    if (payroll > 0) blockers.push("posted_payroll");
    if (openApprovals > 0) blockers.push("pending_approvals");
    return { eligible: blockers.length === 0, blockers };
  }

  /** Retire an eligible organization without erasing its historical evidence. */
  export async function remove(props: { headers: IAuth.IHeaders; id: string }): Promise<{ success: true }> {
    const actor = await AuthProvider.authorize(props.headers);
    await ownerEnsure(props.id, actor.id);
    const check = await deleteCheck(props);
    if (!check.eligible) throw ErrorUtil.conflict(`Organization deletion is blocked by: ${check.blockers.join(", ")}.`);
    const now = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.organizations.update({ where: { id: props.id }, data: { active: false, status: "deleted", updated_at: now } }),
      MyGlobal.prisma.sessions.updateMany({ where: { selected_organization_id: props.id, revoked_at: null }, data: { revoked_at: now, selected_organization_id: null } }),
      MyGlobal.prisma.audit_events.create({ data: { id: randomUUID(), organization_id: props.id, user_id: actor.id, system_principal_id: null, action: "organization.delete", target_type: "organization", target_id: props.id, before_value: "active", after_value: "deleted", reason: "Owner requested eligible organization retirement", created_at: now } }),
    ]);
    return { success: true };
  }

  /** Map a persisted organization row to its public DTO. */
  export function transform(row: Prisma.organizationsGetPayload<{}>): IOrganization {
    return { id: row.id as IOrganization["id"], name: row.name, code: row.code, status: row.status, baseCurrency: row.base_currency, timezone: row.timezone, fiscalStartMonth: row.fiscal_start_month as IOrganization["fiscalStartMonth"], defaultTaxJurisdiction: row.default_tax_jurisdiction, defaultPaymentTerm: row.default_payment_term, negativeStockPolicy: row.negative_stock_policy, approvalThreshold: Number(row.approval_threshold), numberingPrefix: row.numbering_prefix, active: row.active, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() };
  }

  async function ownerEnsure(id: string, userId: string) {
    const owner = await MyGlobal.prisma.memberships.findFirst({ where: { organization_id: id, user_id: userId, status: "active", baseline_role: "Owner" } });
    if (owner === null) throw ErrorUtil.forbidden("Only an Owner may manage organization retirement.");
  }
}
