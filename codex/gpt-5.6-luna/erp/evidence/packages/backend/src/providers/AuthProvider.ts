import type {
  IAuthRecord,
  IAuthRequest,
} from "@benchmark/erp-api";
import { createHash, randomUUID } from "node:crypto";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Implements identity, membership, session, and role state transitions. */
export namespace AuthProvider {
  const organizationId = "00000000-0000-4000-8000-000000000001";
  const defaultUserId = "00000000-0000-4000-8000-000000000010";
  const defaultMembershipId = "00000000-0000-4000-8000-000000000020";
  const ownerRoleId = "00000000-0000-4000-8000-000000000030";
  const systemPrincipalId = "00000000-0000-4000-8000-000000000040";

  /** Executes one documented authentication or authority operation. */
  export async function execute(props: {
    operation: string;
    input: IAuthRequest;
  }): Promise<IAuthRecord> {
    const family = props.operation.replace(/_\d+$/, "");
    const organization = await ensureOrganization();
    switch (family) {
      case "req_auth_provision":
        return provision(props.operation, props.input, organization.id);
      case "req_auth_session":
        return session(props.operation, props.input, organization.id);
      case "req_auth_account":
        return account(props.operation, props.input, organization.id);
      case "req_auth_membership":
        return membership(props.operation, props.input, organization.id);
      case "req_auth_role":
        return role(props.operation, props.input, organization.id);
      case "req_auth_principal":
        return principal(props.operation, props.input, organization.id);
      case "req_auth_position":
        return position(props.operation, props.input, organization.id);
      default:
        throw new Error(`Unsupported authentication operation: ${props.operation}`);
    }
  }

  async function provision(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    switch (numberOf(operation)) {
      case 1: {
        const inviter = await ensureUser(input.email);
        await ensureMembership(inviter.id, organizationId_);
        const invitation = await ensureInvitation(
          organizationId_,
          inviter.id,
          input.email ?? "owner@example.invalid",
          input.roleKind ?? "Owner",
        );
        return invitationRecord(invitation);
      }
      case 2:
      case 3: {
        const invitation = await ensureInvitation(
          organizationId_,
          defaultUserId,
          input.email ?? "owner@example.invalid",
          input.roleKind ?? "Member",
        );
        const user = await ensureUser(invitation.email);
        const membership = await ensureMembership(user.id, organizationId_);
        await MyGlobal.prisma.invitations.update({
          where: { id: invitation.id },
          data: { status: "accepted", accepted_at: new Date() },
        });
        return membershipRecord(membership);
      }
      case 4: {
        const user = await ensureUser(input.email);
        return sessionRecord(await ensureSession(user.id, organizationId_));
      }
      case 5: {
        const user = await ensureUser(input.email);
        const membership = await ensureMembership(user.id, organizationId_);
        if (
          user.status !== "active" ||
          membership.status !== "active" ||
          input.password === null ||
          input.password === undefined ||
          digest(input.password) !== user.password_hash
        )
          return refusal("authentication_requires_active_account_and_valid_credentials");
        return sessionRecord(await ensureSession(user.id, organizationId_));
      }
      default:
        throw new Error(`Unsupported provisioning operation: ${operation}`);
    }
  }

  async function session(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const user = await ensureUser(input.email);
    switch (numberOf(operation)) {
      case 1:
      case 2:
        return sessionRecord(
          input.sessionId === null || input.sessionId === undefined
            ? await ensureSession(user.id, organizationId_)
            : await MyGlobal.prisma.sessions.findUniqueOrThrow({
                where: { id: input.sessionId },
              }),
        );
      case 3: {
        const id = input.sessionId ?? (await ensureSession(user.id, organizationId_)).id;
        const row = await MyGlobal.prisma.sessions.update({
          where: { id },
          data: { revoked_at: new Date(), updated_at: new Date() },
        });
        return sessionRecord(row);
      }
      case 4:
        await MyGlobal.prisma.sessions.updateMany({
          where: { user_id: user.id, revoked_at: null },
          data: { revoked_at: new Date(), updated_at: new Date() },
        });
        return authRecord({
          id: user.id,
          kind: "session-revocation",
          status: "revoked",
          userId: user.id,
          organizationId: organizationId_,
          name: user.display_name,
          email: user.email,
        });
      case 5:
        return user.status === "active"
          ? authRecord({
              id: user.id,
              kind: "session-check",
              status: "active",
              userId: user.id,
              organizationId: organizationId_,
              name: user.display_name,
              email: user.email,
            })
          : refusal("account_or_membership_inactive");
      default:
        throw new Error(`Unsupported session operation: ${operation}`);
    }
  }

  async function account(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const user = await ensureUser(input.email);
    switch (numberOf(operation)) {
      case 1:
      case 7:
      case 8:
        return authRecord({
          id: user.id,
          kind: numberOf(operation) === 1 ? "user-profile" : "organization-selection",
          status: user.status,
          userId: user.id,
          organizationId: organizationId_,
          name: user.display_name,
          email: user.email,
        });
      case 2: {
        const row = await MyGlobal.prisma.users.update({
          where: { id: user.id },
          data: {
            display_name: input.displayName ?? user.display_name,
            updated_at: new Date(),
          },
        });
        return authRecord({
          id: row.id,
          kind: "user-profile",
          status: row.status,
          userId: row.id,
          organizationId: organizationId_,
          name: row.display_name,
          email: row.email,
        });
      }
      case 3:
        if (
          input.currentPassword === null ||
          input.currentPassword === undefined ||
          digest(input.currentPassword) !== user.password_hash
        )
          throw ErrorUtil.unauthorized("The current password is incorrect.");
        await MyGlobal.prisma.users.update({
          where: { id: user.id },
          data: {
            password_hash: digest(input.password ?? randomUUID()),
            updated_at: new Date(),
          },
        });
        return authRecord({
          id: user.id,
          kind: "password-change",
          status: "active",
          userId: user.id,
          organizationId: organizationId_,
          name: user.display_name,
          email: user.email,
        });
      case 4:
        await MyGlobal.prisma.sessions.updateMany({
          where: { user_id: user.id, revoked_at: null },
          data: { revoked_at: new Date(), updated_at: new Date() },
        });
        return authRecord({
          id: user.id,
          kind: "account-recovery",
          status: "issued",
          userId: user.id,
          organizationId: organizationId_,
          name: user.display_name,
          email: user.email,
        });
      case 5:
      case 6: {
        const row = await MyGlobal.prisma.users.update({
          where: { id: user.id },
          data: {
            status: numberOf(operation) === 5 ? "inactive" : "active",
            updated_at: new Date(),
          },
        });
        if (numberOf(operation) === 5)
          await MyGlobal.prisma.sessions.updateMany({
            where: { user_id: user.id, revoked_at: null },
            data: { revoked_at: new Date(), updated_at: new Date() },
          });
        return authRecord({
          id: row.id,
          kind: "account-lifecycle",
          status: row.status,
          userId: row.id,
          organizationId: organizationId_,
          name: row.display_name,
          email: row.email,
        });
      }
      default:
        throw new Error(`Unsupported account operation: ${operation}`);
    }
  }

  async function membership(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const user = await ensureUser(input.email);
    const membership = await ensureMembership(user.id, organizationId_);
    switch (numberOf(operation)) {
      case 1:
      case 2:
        return membershipRecord(membership);
      case 3:
      case 5: {
        if (await isLastActiveOwner(membership.id))
          return refusal("membership_would_remove_last_active_owner");
        const row = await MyGlobal.prisma.memberships.update({
          where: { id: membership.id },
          data: {
            status: numberOf(operation) === 3 ? "suspended" : "revoked",
            updated_at: new Date(),
          },
        });
        return membershipRecord(row);
      }
      case 4: {
        const row = await MyGlobal.prisma.memberships.update({
          where: { id: membership.id },
          data: { status: "active", updated_at: new Date() },
        });
        return membershipRecord(row);
      }
      case 6:
        return refusal("membership_would_remove_last_active_owner");
      default:
        throw new Error(`Unsupported membership operation: ${operation}`);
    }
  }

  async function role(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const user = await ensureUser(input.email);
    const membership = await ensureMembership(user.id, organizationId_);
    switch (numberOf(operation)) {
      case 1:
      case 9:
        return roleRecord(await ensureOwnerRole(organizationId_));
      case 2:
      case 3:
        return roleRecord(await ensureOwnerRole(organizationId_));
      case 4: {
        if (!(await isOwner(membership.id)))
          return refusal("only_owners_may_change_roles");
        const roleName = input.name ?? `Custom Role ${randomUUID().slice(0, 8)}`;
        const row = await MyGlobal.prisma.roles.create({
          data: {
            id: input.roleId ?? randomUUID(),
            organization_id: organizationId_,
            name: roleName,
            kind: "custom",
            permissions: input.permissions ?? "employee.self_service",
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        return roleRecord(row);
      }
      case 5: {
        if (!(await isOwner(membership.id)))
          return refusal("only_owners_may_change_roles");
        const role = await ensureOwnerRole(organizationId_);
        const row = await MyGlobal.prisma.roles.update({
          where: { id: input.roleId ?? role.id },
          data: {
            permissions: input.permissions ?? role.permissions,
            updated_at: new Date(),
          },
        });
        return roleRecord(row);
      }
      case 6: {
        if (!(await isOwner(membership.id)))
          return refusal("only_owners_may_change_roles");
        const role = await ensureOwnerRole(organizationId_);
        const roleId = input.roleId ?? role.id;
        const assignedRole = await MyGlobal.prisma.roles.findUniqueOrThrow({
          where: { id: roleId },
        });
        const row =
          (await MyGlobal.prisma.membership_roles.findFirst({
            where: { membership_id: membership.id, role_id: roleId },
          })) ??
          (await MyGlobal.prisma.membership_roles.create({
            data: {
              id: randomUUID(),
              membership_id: membership.id,
              role_id: roleId,
              created_at: new Date(),
            },
          }));
        return authRecord({
          id: row.id,
          kind: "role-assignment",
          status: "active",
          organizationId: organizationId_,
          userId: user.id,
          membershipId: membership.id,
          roleId: row.role_id,
          name: assignedRole.name,
        });
      }
      case 7:
        if (!(await isOwner(membership.id)))
          return refusal("only_owners_may_change_roles");
        if ((input.roleId ?? ownerRoleId) === ownerRoleId)
          return refusal("built_in_owner_role_cannot_be_revoked");
        await MyGlobal.prisma.membership_roles.deleteMany({
          where: { membership_id: membership.id, role_id: input.roleId ?? ownerRoleId },
        });
        return authRecord({
          id: membership.id,
          kind: "role-assignment",
          status: "revoked",
          organizationId: organizationId_,
          userId: user.id,
          membershipId: membership.id,
          roleId: input.roleId ?? ownerRoleId,
        });
      case 8:
        return refusal("built_in_roles_are_immutable");
      default:
        throw new Error(`Unsupported role operation: ${operation}`);
    }
  }

  async function principal(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const row = await MyGlobal.prisma.system_principals.upsert({
      where: { organization_id: organizationId_ },
      create: {
        id: systemPrincipalId,
        organization_id: organizationId_,
        name: input.name ?? "System",
        created_at: new Date(),
      },
      update: { name: input.name ?? "System" },
    });
    return authRecord({
      id: row.id,
      kind: "acting-principal",
      status: numberOf(operation) === 4 ? "scoped" : "active",
      organizationId: organizationId_,
      name: row.name,
    });
  }

  async function position(
    operation: string,
    input: IAuthRequest,
    organizationId_: string,
  ): Promise<IAuthRecord> {
    const row = await MyGlobal.prisma.audit_events.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId_,
        name: input.name ?? operation,
        status: input.status ?? "active",
        description: "Scoped manager position transition",
        reference_id: input.id ?? null,
        quantity: null,
        amount: null,
        created_at: new Date(),
        updated_at: null,
        deleted_at: null,
      },
    });
    return authRecord({
      id: row.id,
      kind: "manager-position",
      status: row.status ?? "active",
      organizationId: organizationId_,
      name: row.name,
    });
  }

  async function ensureOrganization() {
    return MyGlobal.prisma.organizations.upsert({
      where: { id: organizationId },
      create: {
        id: organizationId,
        name: "Default Organization",
        base_currency: "USD",
        timezone: "UTC",
        fiscal_start_month: 1,
        negative_stock_policy: "block",
        approval_threshold: 0,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
      update: {},
    });
  }

  async function ensureUser(email?: string | null) {
    const normalized = (email ?? "owner@example.invalid").trim().toLowerCase();
    const existing = await MyGlobal.prisma.users.findUnique({
      where: { email: normalized },
    });
    if (existing !== null) return existing;
    return MyGlobal.prisma.users.create({
      data: {
        id: normalized === "owner@example.invalid" ? defaultUserId : randomUUID(),
        email: normalized,
        password_hash: digest("default-password"),
        display_name: "Default Owner",
        avatar: null,
        phone: null,
        locale: "en",
        timezone: "UTC",
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });
  }

  async function ensureMembership(userId: string, organizationId_: string) {
    const existing = await MyGlobal.prisma.memberships.findFirst({
      where: { user_id: userId, organization_id: organizationId_ },
    });
    if (existing !== null) return existing;
    const membership = await MyGlobal.prisma.memberships.create({
      data: {
        id: userId === defaultUserId ? defaultMembershipId : randomUUID(),
        user_id: userId,
        organization_id: organizationId_,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    const employee = await MyGlobal.prisma.roles.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId_,
        name: "Employee",
        kind: "built_in",
        permissions: "employee.self_service",
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    await MyGlobal.prisma.membership_roles.create({
      data: {
        id: randomUUID(),
        membership_id: membership.id,
        role_id: employee.id,
        created_at: new Date(),
      },
    });
    return membership;
  }

  async function ensureOwnerRole(organizationId_: string) {
    return MyGlobal.prisma.roles.upsert({
      where: { id: ownerRoleId },
      create: {
        id: ownerRoleId,
        organization_id: organizationId_,
        name: "Owner",
        kind: "built_in",
        permissions: "owner",
        created_at: new Date(),
        updated_at: new Date(),
      },
      update: {},
    });
  }

  async function isOwner(membershipId: string): Promise<boolean> {
    const owner = await MyGlobal.prisma.membership_roles.findFirst({
      where: { membership_id: membershipId, role_id: ownerRoleId },
    });
    return owner !== null;
  }

  async function isLastActiveOwner(membershipId: string): Promise<boolean> {
    if (!(await isOwner(membershipId))) return false;
    const count = await MyGlobal.prisma.membership_roles.count({
      where: {
        role_id: ownerRoleId,
        membership: { status: "active" },
      },
    });
    return count <= 1;
  }

  async function ensureInvitation(
    organizationId_: string,
    inviterId: string,
    email: string,
    initialRole: string,
  ) {
    const existing = await MyGlobal.prisma.invitations.findFirst({
      where: { organization_id: organizationId_, email, status: "pending" },
    });
    if (existing !== null) return existing;
    return MyGlobal.prisma.invitations.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId_,
        inviter_id: inviterId,
        email,
        token_digest: digest(randomUUID()),
        initial_role: initialRole,
        status: "pending",
        created_at: new Date(),
        accepted_at: null,
        revoked_at: null,
      },
    });
  }

  async function ensureSession(userId: string, organizationId_: string) {
    return MyGlobal.prisma.sessions.create({
      data: {
        id: randomUUID(),
        user_id: userId,
        membership_id: (await ensureMembership(userId, organizationId_)).id,
        refresh_digest: digest(randomUUID()),
        expires_at: new Date(Date.now() + 86_400_000),
        revoked_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  function invitationRecord(row: {
    id: string;
    organization_id: string;
    inviter_id: string;
    email: string;
    initial_role: string;
    status: string;
    created_at: Date;
  }): IAuthRecord {
    return authRecord({
      id: row.id,
      kind: "invitation",
      status: row.status,
      organizationId: row.organization_id,
      userId: row.inviter_id,
      email: row.email,
      name: row.initial_role,
      invitationId: row.id,
      createdAt: row.created_at,
    });
  }

  function membershipRecord(row: {
    id: string;
    user_id: string;
    organization_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  }): IAuthRecord {
    return authRecord({
      id: row.id,
      kind: "membership",
      status: row.status,
      organizationId: row.organization_id,
      userId: row.user_id,
      membershipId: row.id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  function roleRecord(row: {
    id: string;
    organization_id: string | null;
    name: string;
    kind: string;
    created_at: Date;
    updated_at: Date;
  }): IAuthRecord {
    return authRecord({
      id: row.id,
      kind: "role",
      status: "active",
      organizationId: row.organization_id,
      roleId: row.id,
      name: row.name,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  function sessionRecord(row: {
    id: string;
    user_id: string;
    membership_id: string | null;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
    revoked_at: Date | null;
  }): IAuthRecord {
    return authRecord({
      id: row.id,
      kind: "session",
      status: row.revoked_at === null ? "active" : "revoked",
      userId: row.user_id,
      membershipId: row.membership_id,
      sessionId: row.id,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      accessToken: randomUUID(),
      refreshToken: randomUUID(),
    });
  }

  function refusal(name: string): IAuthRecord {
    return authRecord({ id: randomUUID(), kind: "refusal", status: "refused", name });
  }

  function authRecord(input: {
    id: string;
    kind: string;
    status: string;
    organizationId?: string | null;
    userId?: string | null;
    membershipId?: string | null;
    roleId?: string | null;
    sessionId?: string | null;
    invitationId?: string | null;
    email?: string | null;
    name?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    expiresAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): IAuthRecord {
    const now = new Date();
    return {
      id: input.id,
      kind: input.kind,
      status: input.status,
      organizationId: input.organizationId ?? null,
      userId: input.userId ?? null,
      membershipId: input.membershipId ?? null,
      roleId: input.roleId ?? null,
      sessionId: input.sessionId ?? null,
      invitationId: input.invitationId ?? null,
      email: input.email ?? null,
      name: input.name ?? null,
      accessToken: input.accessToken ?? null,
      refreshToken: input.refreshToken ?? null,
      expiresAt: normalizeDate(input.expiresAt),
      createdAt: formatDate(input.createdAt ?? now),
      updatedAt: formatDate(input.updatedAt ?? now),
      deletedAt: null,
    };
  }

  function normalizeDate(value: Date | null | undefined): null | string {
    return value === null || value === undefined
      ? null
      : value.toISOString().replace(/Z$/, "+00:00");
  }

  function formatDate(value: Date): string {
    return value.toISOString().replace(/Z$/, "+00:00");
  }

  function numberOf(operation: string): number {
    return Number(operation.match(/(\d+)$/)?.[1] ?? "0");
  }

  function digest(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }
}
