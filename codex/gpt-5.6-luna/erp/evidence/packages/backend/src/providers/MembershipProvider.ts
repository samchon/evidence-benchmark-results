import { createHmac, randomBytes, randomUUID } from "node:crypto";

import type { IAuth, IMembership, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns invitation issuance and organization membership lifecycle rules. */
export namespace MembershipProvider {
  /** Issue one Owner invitation for a currently active organization. */
  export async function invite(props: {
    headers: IAuth.IHeaders;
    input: IMembership.IInvite;
  }): Promise<IMembership> {
    const actor = await AuthProvider.authorize(props.headers);
    const organizationId = await selectedOrganization(actor);
    const owner = await MyGlobal.prisma.memberships.findFirst({
      where: { organization_id: organizationId, user_id: actor.id, status: "active", baseline_role: "Owner" },
    });
    if (owner === null) throw ErrorUtil.forbidden("Only an Owner may issue invitations.");
    const email = props.input.email.toLowerCase();
    const pending = await MyGlobal.prisma.invitations.findFirst({
      where: { organization_id: organizationId, email, status: "pending" },
    });
    if (pending !== null) throw ErrorUtil.conflict("A pending invitation already exists for this email.");
    const existingUser = await MyGlobal.prisma.users.findUnique({ where: { email }, select: { id: true } });
    if (existingUser !== null && await MyGlobal.prisma.memberships.findUnique({ where: { user_id_organization_id: { user_id: existingUser.id, organization_id: organizationId } }, select: { status: true } }) !== null)
      throw ErrorUtil.conflict("This email already has membership in the organization.");
    const role = props.input.initialRole ?? "Employee";
    const token = randomBytes(32).toString("base64url");
    const now = new Date();
    const invitation = await MyGlobal.prisma.invitations.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId,
        inviter_user_id: actor.id,
        recipient_user_id: null,
        email,
        initial_role: role,
        status: "pending",
        token_hash: hash(token),
        expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        accepted_at: null,
        created_at: now,
        membership_id: null,
      },
    });
    return {
      id: invitation.id as IMembership["id"],
      organizationId: invitation.organization_id as IMembership["organizationId"],
      organizationName: (await MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { name: true } })).name,
      status: "invited",
      baselineRole: invitation.initial_role,
      roles: [],
      createdAt: invitation.created_at.toISOString(),
      updatedAt: invitation.created_at.toISOString(),
      invitationToken: token,
    };
  }

  /** List every organization membership owned by the signed-in user. */
  export async function index(props: { headers: IAuth.IHeaders }): Promise<IPage<IMembership>> {
    const actor = await AuthProvider.authorize(props.headers);
    const rows = await MyGlobal.prisma.memberships.findMany({
      where: { user_id: actor.id },
      include: { organization: true, roles: { include: { role: true } } },
      orderBy: { created_at: "asc" },
    });
    return {
      pagination: { current: 1, limit: 0, records: rows.length, pages: 1 },
      data: rows.map(transform),
    };
  }

  /** Transition a membership, preserving role assignments and last-owner safety. */
  export async function status(props: {
    headers: IAuth.IHeaders;
    id: string;
    input: IMembership.IStatus;
  }): Promise<IMembership> {
    const actor = await AuthProvider.authorize(props.headers);
    const current = await MyGlobal.prisma.memberships.findUnique({
      where: { id: props.id },
      include: { organization: true, roles: { include: { role: true } } },
    });
    if (current === null) throw ErrorUtil.notFound("No membership has this identifier.");
    const owner = await MyGlobal.prisma.memberships.findFirst({
      where: { organization_id: current.organization_id, user_id: actor.id, status: "active", baseline_role: "Owner" },
    });
    if (owner === null) throw ErrorUtil.forbidden("Only an Owner may change membership state.");
    if (current.baseline_role === "Owner" && current.status === "active" && props.input.status !== "active") {
      const owners = await MyGlobal.prisma.memberships.count({
        where: { organization_id: current.organization_id, status: "active", baseline_role: "Owner" },
      });
      if (owners <= 1) throw ErrorUtil.conflict("The organization must retain at least one active Owner.");
    }
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const row = await tx.memberships.update({
        where: { id: current.id },
        data: { status: props.input.status, updated_at: new Date() },
        include: { organization: true, roles: { include: { role: true } } },
      });
      if (props.input.status !== "active")
        await tx.sessions.updateMany({
          where: { user_id: current.user_id, selected_organization_id: current.organization_id, revoked_at: null },
          data: { revoked_at: new Date() },
        });
      return row;
    });
    return transform(updated);
  }

  /** Map a membership row and role joins to the public contract. */
  export function transform(
    row: Prisma.membershipsGetPayload<{ include: { organization: true; roles: { include: { role: true } } } }>,
  ): IMembership {
    return {
      id: row.id as IMembership["id"],
      organizationId: row.organization_id as IMembership["organizationId"],
      organizationName: row.organization.name,
      status: row.status as IMembership["status"],
      baselineRole: row.baseline_role,
      roles: row.roles.map((entry) => entry.role.name),
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  async function selectedOrganization(actor: AuthProvider.Payload): Promise<string> {
    const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } });
    if (session?.selected_organization_id === null || session === null)
      throw ErrorUtil.forbidden("Select an active organization before organization work.");
    return session.selected_organization_id;
  }

  function hash(value: string): string {
    return createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("hex");
  }
}
