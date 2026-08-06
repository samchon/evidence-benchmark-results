import type { IMembership, IRole, IPage } from "@benchmark/erp-api";
import crypto from "node:crypto";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider, type SessionPayload } from "./AuthProvider";
import { PaginationUtil } from "../utils/PaginationUtil";

export namespace MembershipProvider {
  async function owner(session: SessionPayload): Promise<string> {
    if (!session.organizationId) throw ErrorUtil.forbidden("Select an active organization first.");
    const membership = await MyGlobal.prisma.memberships.findUnique({ where: { user_id_organization_id: { user_id: session.userId, organization_id: session.organizationId } }, include: { roles: { include: { role: true } } } });
    if (membership?.status !== "active" || !membership.roles.some((entry: any) => entry.role.key === "Owner")) throw ErrorUtil.forbidden("Only an Owner may administer memberships.");
    return session.organizationId;
  }

  export async function list(p: { session: SessionPayload; input: IMembership.IRequest }): Promise<IPage<IMembership>> {
    const organizationId = await owner(p.session);
    const where: any = { organization_id: organizationId, ...(p.input.status ? { status: p.input.status } : {}) };
    const { limit, current } = PaginationUtil.page(p.input);
    const [records, rows] = await Promise.all([
      MyGlobal.prisma.memberships.count({ where }),
      MyGlobal.prisma.memberships.findMany({ where, include: { roles: { include: { role: true } } }, skip: (current - 1) * limit, take: limit === 0 ? undefined : limit, orderBy: { created_at: "asc" } }),
    ]);
    return { data: rows.map(AuthProvider.membership), pagination: { current, limit, records, pages: limit === 0 ? 1 : Math.ceil(records / limit) } };
  }

  export async function update(p: { session: SessionPayload; id: string; body: IMembership.IUpdate }): Promise<IMembership> {
    const organizationId = await owner(p.session);
    const current = await MyGlobal.prisma.memberships.findFirst({ where: { id: p.id, organization_id: organizationId }, include: { roles: { include: { role: true } } } });
    if (!current) throw ErrorUtil.notFound("Membership not found.");
    if (current.status === "active" && p.body.status !== "active" && current.roles.some((entry: any) => entry.role.key === "Owner")) {
      const owners = await MyGlobal.prisma.memberships.count({ where: { organization_id: organizationId, status: "active", roles: { some: { role: { key: "Owner" } } } } });
      if (owners <= 1) throw ErrorUtil.conflict("The last active Owner cannot be suspended or revoked.");
    }
    const updated = await MyGlobal.prisma.memberships.update({ where: { id: current.id }, data: { status: p.body.status, updated_at: new Date() }, include: { roles: { include: { role: true } } } });
    return AuthProvider.membership(updated);
  }

  export async function assignRole(p: { session: SessionPayload; id: string; body: IMembership.IRoleAssignment }): Promise<IMembership> {
    const organizationId = await owner(p.session);
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: p.id, organization_id: organizationId }, include: { roles: { include: { role: true } } } });
    const role = await MyGlobal.prisma.roles.findUnique({ where: { organization_id_key: { organization_id: organizationId, key: p.body.roleKey } } });
    if (!membership || !role) throw ErrorUtil.notFound("Membership or role not found.");
    if (membership.status !== "active") throw ErrorUtil.conflict("Roles can only be assigned to active memberships.");
    if (!p.body.assigned && role.key === "Owner" && membership.roles.some((entry: any) => entry.role.key === "Owner")) {
      const owners = await MyGlobal.prisma.memberships.count({ where: { organization_id: organizationId, status: "active", roles: { some: { role: { key: "Owner" } } } } });
      if (owners <= 1) throw ErrorUtil.conflict("The last active Owner role cannot be removed.");
    }
    if (p.body.assigned) await MyGlobal.prisma.membership_roles.upsert({ where: { membership_id_role_id: { membership_id: membership.id, role_id: role.id } }, create: { id: crypto.randomUUID(), membership_id: membership.id, role_id: role.id, created_at: new Date() }, update: {} });
    else await MyGlobal.prisma.membership_roles.deleteMany({ where: { membership_id: membership.id, role_id: role.id } });
    return AuthProvider.membership(await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id: membership.id }, include: { roles: { include: { role: true } } } }));
  }

  export async function roles(p: { session: SessionPayload; input: IRole.IRequest }): Promise<IPage<IRole>> {
    const organizationId = await owner(p.session);
    const rows = await MyGlobal.prisma.roles.findMany({ where: { organization_id: organizationId }, orderBy: { created_at: "asc" } });
    return { data: rows.map((row: any) => ({ id: row.id, key: row.key, name: row.name, builtIn: row.built_in, permissions: JSON.parse(row.permissions), createdAt: row.created_at.toISOString() })), pagination: { current: 1, limit: rows.length, records: rows.length, pages: 1 } };
  }
}
