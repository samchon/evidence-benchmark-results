import { randomUUID } from "node:crypto";
import type { IAuth, IRole, IMembership, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";
import { MembershipProvider } from "./MembershipProvider";

/** Owns organization role composition and owner-controlled assignment. */
export namespace RoleProvider {
  export async function index(headers: IAuth.IHeaders): Promise<IPage<IRole>> {
    const oid = await ownerOrganization(headers);
    const rows = await MyGlobal.prisma.roles.findMany({ where: { organization_id: oid }, include: { permissions: true }, orderBy: { name: "asc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(transform) };
  }

  export async function create(headers: IAuth.IHeaders, input: IRole.ICreate): Promise<IRole> {
    const oid = await ownerOrganization(headers);
    const now = new Date();
    const row = await MyGlobal.prisma.roles.create({ data: { id: randomUUID(), organization_id: oid, name: input.name.trim(), built_in: false, created_at: now, updated_at: now, permissions: { create: (input.permissions ?? []).map((permission) => ({ id: randomUUID(), permission, created_at: now })) } }, include: { permissions: true } });
    return transform(row);
  }

  export async function update(headers: IAuth.IHeaders, id: string, input: IRole.IUpdate): Promise<IRole> {
    const oid = await ownerOrganization(headers);
    const current = await MyGlobal.prisma.roles.findFirst({ where: { id, organization_id: oid }, include: { permissions: true } });
    if (current === null) throw ErrorUtil.notFound("No role has this identifier.");
    if (current.built_in) throw ErrorUtil.conflict("Built-in roles cannot be edited.");
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      if (input.permissions !== undefined) {
        await tx.role_permissions.deleteMany({ where: { role_id: id } });
        if (input.permissions.length > 0) await tx.role_permissions.createMany({ data: input.permissions.map((permission) => ({ id: randomUUID(), role_id: id, permission, created_at: new Date() })) });
      }
      return tx.roles.update({ where: { id }, data: { ...(input.name !== undefined ? { name: input.name.trim() } : {}), updated_at: new Date() }, include: { permissions: true } });
    });
    return transform(row);
  }

  export async function remove(headers: IAuth.IHeaders, id: string): Promise<{ success: true }> {
    const oid = await ownerOrganization(headers);
    const role = await MyGlobal.prisma.roles.findFirst({ where: { id, organization_id: oid } });
    if (role === null) throw ErrorUtil.notFound("No role has this identifier.");
    if (role.built_in) throw ErrorUtil.conflict("Built-in roles cannot be deleted.");
    const assigned = await MyGlobal.prisma.membership_roles.count({ where: { role_id: id } });
    if (assigned > 0) throw ErrorUtil.conflict("A role held by a member cannot be deleted.");
    await MyGlobal.prisma.roles.delete({ where: { id } });
    return { success: true };
  }

  export async function assign(headers: IAuth.IHeaders, input: IRole.IAssign): Promise<IMembership> {
    const oid = await ownerOrganization(headers);
    const role = await MyGlobal.prisma.roles.findFirst({ where: { id: input.roleId, organization_id: oid } });
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: input.membershipId, organization_id: oid, status: "active" } });
    if (role === null || membership === null) throw ErrorUtil.notFound("The role or active membership was not found.");
    await MyGlobal.prisma.membership_roles.upsert({ where: { membership_id_role_id: { membership_id: membership.id, role_id: role.id } }, create: { id: randomUUID(), membership_id: membership.id, role_id: role.id, created_at: new Date() }, update: {} });
    return currentMembership(membership.id);
  }

  export async function revoke(headers: IAuth.IHeaders, input: IRole.IRevoke): Promise<IMembership> {
    const oid = await ownerOrganization(headers);
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: input.membershipId, organization_id: oid, status: "active" } });
    const role = await MyGlobal.prisma.roles.findFirst({ where: { id: input.roleId, organization_id: oid } });
    if (role === null || membership === null) throw ErrorUtil.notFound("The role or active membership was not found.");
    if (membership.baseline_role === "Owner" && role.name === "Owner") throw ErrorUtil.conflict("The baseline Owner role cannot be revoked.");
    await MyGlobal.prisma.membership_roles.deleteMany({ where: { membership_id: membership.id, role_id: role.id } });
    return currentMembership(membership.id);
  }

  function transform(row: Prisma.rolesGetPayload<{ include: { permissions: true } }>): IRole { return { id: row.id as IRole["id"], name: row.name, builtIn: row.built_in, permissions: row.permissions.map((permission) => permission.permission), createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
  async function ownerOrganization(headers: IAuth.IHeaders): Promise<string> { const actor = await AuthProvider.authorize(headers); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (session?.selected_organization_id === null || session === null) throw ErrorUtil.forbidden("Select an active organization before role work."); const owner = await MyGlobal.prisma.memberships.findFirst({ where: { organization_id: session.selected_organization_id, user_id: actor.id, status: "active", baseline_role: "Owner" } }); if (owner === null) throw ErrorUtil.forbidden("Only an Owner may manage roles."); return session.selected_organization_id; }
  async function currentMembership(id: string): Promise<IMembership> { const row = await MyGlobal.prisma.memberships.findUniqueOrThrow({ where: { id }, include: { organization: true, roles: { include: { role: true } } } }); return MembershipProvider.transform(row); }
}
