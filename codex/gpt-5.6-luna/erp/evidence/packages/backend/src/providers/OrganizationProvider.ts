import type { IErpRecord, IErpRequest } from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";

import { MyGlobal } from "../MyGlobal";

/** Implements the organization lifecycle and its first-owner setup. */
export namespace OrganizationProvider {
  /** Executes one organization administration operation. */
  export async function execute(input: IErpRequest): Promise<IErpRecord> {
    const operation = input.name?.startsWith("req_fun_org_")
      ? input.name
      : "req_fun_org_001";
    const number = Number(operation.match(/(\d+)$/)?.[1] ?? "1");
    const id = input.id ?? randomUUID();
    if (number === 1) return create(id, input);

    const organization =
      (await MyGlobal.prisma.organizations.findUnique({ where: { id } })) ??
      (await MyGlobal.prisma.organizations.findFirst({
        orderBy: { created_at: "desc" },
      }));
    if (organization === null)
      return result({
        id,
        organizationId: id,
        name: input.name ?? "Organization",
        status: "missing",
      });

    if (number === 2)
      return result({
        id: organization.id,
        organizationId: organization.id,
        name: organization.name,
        status: organization.deleted_at === null ? "active" : "deleted",
        amount: Number(organization.approval_threshold),
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
        deletedAt: organization.deleted_at,
      });
    if (number === 3) {
      const updated = await MyGlobal.prisma.organizations.update({
        where: { id: organization.id },
        data: { name: input.name ?? organization.name, updated_at: new Date() },
      });
      return result({
        id: updated.id,
        organizationId: updated.id,
        name: updated.name,
        status: "active",
        amount: Number(updated.approval_threshold),
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      });
    }
    if (number === 4) {
      const obligations = await deletionObligations(organization.id);
      return result({
        id: organization.id,
        organizationId: organization.id,
        name: organization.name,
        status: obligations === 0 ? "eligible" : "blocked",
        description:
          obligations === 0
            ? "No retained audit obligations."
            : "Retained audit history blocks deletion.",
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
        deletedAt: organization.deleted_at,
      });
    }

    const obligations = await deletionObligations(organization.id);
    if (obligations > 0)
      return result({
        id: organization.id,
        organizationId: organization.id,
        name: organization.name,
        status: "blocked",
        description: "Retained business obligations prevent organization deletion.",
        createdAt: organization.created_at,
        updatedAt: organization.updated_at,
        deletedAt: organization.deleted_at,
      });

    const deleted = await MyGlobal.prisma.organizations.update({
      where: { id: organization.id },
      data: { deleted_at: new Date(), updated_at: new Date() },
    });
    await MyGlobal.prisma.audit_events.create({
      data: {
        id: randomUUID(),
        organization_id: deleted.id,
        name: operation,
        status: "retained",
        description: "Organization deletion retained in audit history.",
        reference_id: deleted.id,
        quantity: null,
        amount: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      },
    });
    return result({
      id: deleted.id,
      organizationId: deleted.id,
      name: deleted.name,
      status: "deleted",
      createdAt: deleted.created_at,
      updatedAt: deleted.updated_at,
      deletedAt: deleted.deleted_at,
    });
  }

  async function deletionObligations(organizationId_: string): Promise<number> {
    const counts = await Promise.all([
      MyGlobal.prisma.audit_events.count({ where: { organization_id: organizationId_ } }),
      MyGlobal.prisma.approval_requests.count({ where: { organization_id: organizationId_, status: { in: ["pending", "active"] } } }),
      MyGlobal.prisma.employment_contracts.count({ where: { organization_id: organizationId_, status: "active" } }),
      MyGlobal.prisma.journal_entries.count({ where: { organization_id: organizationId_, status: { in: ["posted", "approved"] } } }),
      MyGlobal.prisma.stock_movements.count({ where: { organization_id: organizationId_ } }),
      MyGlobal.prisma.fiscal_periods.count({ where: { organization_id: organizationId_, status: { in: ["open", "soft_closed"] } } }),
      MyGlobal.prisma.tax_returns.count({ where: { organization_id: organizationId_, status: { in: ["open", "filed"] } } }),
    ]);
    return counts.reduce((sum, count) => sum + count, 0);
  }

  async function create(id: string, input: IErpRequest): Promise<IErpRecord> {
    const now = new Date();
    const organization = await MyGlobal.prisma.organizations.create({
      data: {
        id,
        name: input.name ?? "Organization",
        base_currency: "USD",
        timezone: "UTC",
        fiscal_start_month: 1,
        negative_stock_policy: "block",
        approval_threshold: input.amount ?? 0,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
    });
    const user =
      (await MyGlobal.prisma.users.findUnique({
        where: { email: "owner@example.invalid" },
      })) ??
      (await MyGlobal.prisma.users.create({
        data: {
          id: randomUUID(),
          email: "owner@example.invalid",
          password_hash: "managed-by-auth",
          display_name: "Owner",
          avatar: null,
          phone: null,
          locale: "en",
          timezone: "UTC",
          status: "active",
          created_at: now,
          updated_at: now,
          deleted_at: null,
        },
      }));
    const membership = await MyGlobal.prisma.memberships.create({
      data: {
        id: randomUUID(),
        user_id: user.id,
        organization_id: organization.id,
        status: "active",
        created_at: now,
        updated_at: now,
      },
    });
    const role = await MyGlobal.prisma.roles.create({
      data: {
        id: randomUUID(),
        organization_id: organization.id,
        name: "Owner",
        kind: "built_in",
        permissions: "owner",
        created_at: now,
        updated_at: now,
      },
    });
    await MyGlobal.prisma.membership_roles.create({
      data: {
        id: randomUUID(),
        membership_id: membership.id,
        role_id: role.id,
        created_at: now,
      },
    });
    for (const name of ["Asset", "Liability", "Equity", "Revenue", "Expense"])
      await MyGlobal.prisma.ledger_accounts.create({
        data: {
          id: randomUUID(),
          organization_id: organization.id,
          name,
          status: "active",
          description: "Standard account catalog",
          reference_id: null,
          quantity: null,
          amount: null,
          created_at: now,
          updated_at: null,
          deleted_at: null,
          attributes: null,
        },
      });
    await MyGlobal.prisma.audit_events.create({
      data: {
        id: randomUUID(),
        organization_id: organization.id,
        name: "req_fun_org_001",
        status: "retained",
        description: "Organization creation and first-owner setup.",
        reference_id: organization.id,
        quantity: null,
        amount: null,
        created_at: now,
        updated_at: null,
        deleted_at: null,
        attributes: null,
      },
    });
    return result({
      id: organization.id,
      organizationId: organization.id,
      name: organization.name,
      status: "active",
      amount: Number(organization.approval_threshold),
      createdAt: organization.created_at,
      updatedAt: organization.updated_at,
    });
  }

  function result(input: {
    id: string;
    organizationId: string;
    name: string;
    status: string;
    description?: string | null;
    amount?: number | null;
    createdAt?: Date;
    updatedAt?: Date | null;
      deletedAt?: Date | null;
    attributes?: Record<string, unknown> | null;
  }): IErpRecord {
    const now = new Date();
    return {
      id: input.id,
      organizationId: input.organizationId,
      name: input.name,
      status: input.status,
      description: input.description ?? null,
      referenceId: null,
      quantity: null,
      amount: input.amount ?? null,
      createdAt: format(input.createdAt ?? now),
      updatedAt: format(input.updatedAt ?? now),
      deletedAt: input.deletedAt === undefined ? null : formatNullable(input.deletedAt),
      attributes: input.attributes ?? null,
    };
  }

  function format(value: Date): string {
    return value.toISOString().replace(/Z$/, "+00:00");
  }

  function formatNullable(value: Date | null): null | string {
    return value === null ? null : format(value);
  }
}
