import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import type { IAuth } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { tags } from "typia";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns credential verification, invitation acceptance, and session tokens. */
export namespace AuthProvider {
  /** Minimal authenticated payload carried between protected providers. */
  export interface Payload {
    /** Global user UUID. */
    id: string & tags.Format<"uuid">;
    /** Session UUID. */
    sessionId: string & tags.Format<"uuid">;
  }

  /** Accept an Owner-issued invitation and establish a global identity. */
  export async function join(props: { input: IAuth.IJoin }): Promise<IAuth.IAuthorized> {
    const now = new Date();
    const tokenHash = digest(props.input.invitationToken);
    const invitation = await MyGlobal.prisma.invitations.findUnique({
      where: { token_hash: tokenHash },
    });
    if (
      invitation === null ||
      invitation.status !== "pending" ||
      invitation.expires_at <= now ||
      invitation.email.toLowerCase() !== props.input.email.toLowerCase()
    )
      throw ErrorUtil.unauthorized("The invitation is invalid or has expired.");

    const passwordHash = hashPassword(props.input.password);
    const existing = await MyGlobal.prisma.users.findUnique({
      where: { email: props.input.email.toLowerCase() },
    });
    const result = await MyGlobal.prisma.$transaction(async (tx) => {
      const user =
        existing ??
        (await tx.users.create({
          data: {
            id: randomUUID(),
            email: props.input.email.toLowerCase(),
            password_hash: passwordHash,
            display_name: props.input.displayName,
            avatar: null,
            phone: null,
            locale: "en-US",
            timezone: "UTC",
            active: true,
            created_at: now,
            updated_at: now,
          },
        }));
      const duplicate = await tx.memberships.findUnique({
        where: {
          user_id_organization_id: {
            user_id: user.id,
            organization_id: invitation.organization_id,
          },
        },
      });
      if (duplicate !== null)
        throw ErrorUtil.conflict("The user already has membership in this organization.");
      const membership = await tx.memberships.create({
        data: {
          id: randomUUID(),
          user_id: user.id,
          organization_id: invitation.organization_id,
          status: "active",
          baseline_role: invitation.initial_role,
          created_at: now,
          updated_at: now,
        },
      });
      const role = await tx.roles.findUnique({
        where: {
          organization_id_name: {
            organization_id: invitation.organization_id,
            name: invitation.initial_role,
          },
        },
      });
      if (role !== null)
        await tx.membership_roles.create({
          data: { id: randomUUID(), membership_id: membership.id, role_id: role.id, created_at: now },
        });
      await tx.invitations.update({
        where: { id: invitation.id },
        data: {
          status: "accepted",
          accepted_at: now,
          recipient_user_id: user.id,
          membership_id: membership.id,
        },
      });
      return user;
    });
    return issue(result);
  }

  /** Authenticate an active user and issue an independent session. */
  export async function login(props: { input: IAuth.ILogin }): Promise<IAuth.IAuthorized> {
    const user = await MyGlobal.prisma.users.findUnique({
      where: { email: props.input.email.toLowerCase() },
    });
    if (user === null || user.active === false || verifyPassword(props.input.password, user.password_hash) === false)
      throw ErrorUtil.unauthorized("Unable to authenticate with the supplied credentials.");
    const membership = await MyGlobal.prisma.memberships.findFirst({
      where: { user_id: user.id, status: "active" },
      select: { id: true },
    });
    if (membership === null)
      throw ErrorUtil.unauthorized("Unable to authenticate with the supplied credentials.");
    return issue(user);
  }

  /** Issue a single-use email-bound recovery proof without revealing account existence. */
  export async function requestRecovery(props: { input: IAuth.IRecoveryRequest }): Promise<IAuth.IRecoveryIssued> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000);
    const token = randomBytes(32).toString("base64url");
    const user = await MyGlobal.prisma.users.findUnique({ where: { email: props.input.email.toLowerCase() } });
    if (user !== null) {
      await MyGlobal.prisma.account_recovery_tokens.create({
        data: { id: randomUUID(), user_id: user.id, token_hash: digest(token), expires_at: expiresAt, used_at: null, created_at: now },
      });
    }
    return { recoveryToken: token, expiresAt: expiresAt.toISOString() };
  }

  /** Complete a single-use recovery proof, reactivating the account when needed. */
  export async function completeRecovery(props: { input: IAuth.IRecoveryComplete }): Promise<{ success: true }> {
    const now = new Date();
    const proof = await MyGlobal.prisma.account_recovery_tokens.findUnique({
      where: { token_hash: digest(props.input.recoveryToken) },
      include: { user: true },
    });
    if (proof === null || proof.used_at !== null || proof.expires_at <= now)
      throw ErrorUtil.unauthorized("The recovery proof is invalid or expired.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.account_recovery_tokens.update({ where: { id: proof.id }, data: { used_at: now } }),
      MyGlobal.prisma.users.update({ where: { id: proof.user_id }, data: { password_hash: hashPassword(props.input.newPassword), active: true, updated_at: now } }),
      MyGlobal.prisma.sessions.updateMany({ where: { user_id: proof.user_id, revoked_at: null }, data: { revoked_at: now } }),
    ]);
    return { success: true };
  }

  /** Rotate an eligible refresh token and preserve selected context. */
  export async function refresh(props: { input: IAuth.IRefresh }): Promise<IAuth.IAuthorized> {
    const session = await MyGlobal.prisma.sessions.findUnique({
      where: { refresh_token_hash: digest(props.input.refreshToken) },
      include: { user: true },
    });
    if (session === null || session.revoked_at !== null || session.expires_at <= new Date() || session.user.active === false)
      throw ErrorUtil.unauthorized("The session is no longer eligible.");
    if (session.selected_organization_id !== null) {
      const membership = await MyGlobal.prisma.memberships.findUnique({
        where: {
          user_id_organization_id: {
            user_id: session.user_id,
            organization_id: session.selected_organization_id,
          },
        },
        select: { status: true },
      });
      if (membership?.status !== "active")
        throw ErrorUtil.unauthorized("The selected organization membership is no longer active.");
    }
    return issue(session.user, session.id, session.selected_organization_id);
  }

  /** Resolve a bearer token and recheck the account on every protected request. */
  export async function authorize(headers: IAuth.IHeaders): Promise<Payload> {
    const match = /^Bearer\s+(.+)$/i.exec(headers.authorization);
    if (match === null) throw ErrorUtil.unauthorized("Authorization is required.");
    const token = match[1];
    if (token === undefined) throw ErrorUtil.unauthorized("Authorization is required.");
    const decoded = decodeAccess(token);
    if (decoded === null || decoded.expiresAt <= Date.now())
      throw ErrorUtil.unauthorized("Authorization is invalid or expired.");
    const session = await MyGlobal.prisma.sessions.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true },
    });
    if (session === null || session.revoked_at !== null || session.user_id !== decoded.userId || session.user.active === false)
      throw ErrorUtil.unauthorized("Authorization is invalid or expired.");
    if (session.selected_organization_id !== null) {
      const membership = await MyGlobal.prisma.memberships.findUnique({
        where: {
          user_id_organization_id: {
            user_id: session.user_id,
            organization_id: session.selected_organization_id,
          },
        },
        select: { status: true },
      });
      if (membership?.status !== "active")
        throw ErrorUtil.forbidden("The selected organization membership is no longer active.");
    }
    return { id: session.user_id as Payload["id"], sessionId: session.id as Payload["sessionId"] };
  }

  /** Return a public profile DTO from a persisted user row. */
  export function transform(user: Prisma.usersGetPayload<{}>): IAuth.IUser {
    return {
      id: user.id as IAuth.IUser["id"],
      email: user.email as IAuth.IUser["email"],
      displayName: user.display_name,
      avatar: user.avatar,
      phone: user.phone,
      locale: user.locale,
      timezone: user.timezone,
      active: user.active,
    };
  }

  /** Hash a credential for bootstrap flows that create the first identity. */
  export function hashCredential(password: string): string {
    return hashPassword(password);
  }

  /** Verify a supplied password against a persisted credential. */
  export function verifyCredential(password: string, encoded: string): boolean {
    return verifyPassword(password, encoded);
  }

  function issue(
    user: Prisma.usersGetPayload<{}>,
    existingSessionId?: string,
    selectedOrganizationId?: string | null,
  ): Promise<IAuth.IAuthorized> {
    const accessSeconds = Number(MyGlobal.env.JWT_ACCESS_TTL_SECONDS);
    const refreshSeconds = Number(MyGlobal.env.JWT_REFRESH_TTL_SECONDS);
    const now = new Date();
    const sessionId = existingSessionId ?? randomUUID();
    const refreshToken = randomBytes(48).toString("base64url");
    const accessExpiresAt = new Date(now.getTime() + accessSeconds * 1000);
    const refreshExpiresAt = new Date(now.getTime() + refreshSeconds * 1000);
    const accessToken = encodeAccess({
      userId: user.id,
      sessionId,
      expiresAt: accessExpiresAt.getTime(),
    });
    return MyGlobal.prisma.sessions
      .upsert({
        where: { id: sessionId },
        create: {
          id: sessionId,
          user_id: user.id,
          refresh_token_hash: digest(refreshToken),
          expires_at: refreshExpiresAt,
          revoked_at: null,
          selected_organization_id: selectedOrganizationId ?? null,
          created_at: now,
        },
        update: {
          refresh_token_hash: digest(refreshToken),
          expires_at: refreshExpiresAt,
          revoked_at: null,
          selected_organization_id: selectedOrganizationId,
        },
      })
      .then(async () => {
        const memberships = await MyGlobal.prisma.memberships.findMany({
          where: { user_id: user.id },
          include: { organization: true, roles: { include: { role: true } } },
          orderBy: { created_at: "asc" },
        });
        return {
          accessToken,
          refreshToken,
          accessExpiresAt: accessExpiresAt.toISOString(),
          refreshExpiresAt: refreshExpiresAt.toISOString(),
          user: transform(user),
          memberships: memberships.map((membership) => ({
            id: membership.id as IAuth.IMembership["id"],
            organizationId: membership.organization_id as IAuth.IMembership["organizationId"],
            organizationName: membership.organization.name,
            status: membership.status as IAuth.IMembership["status"],
            roles: membership.roles.map((entry) => entry.role.name),
          })),
        } satisfies IAuth.IAuthorized;
      });
  }

  function hashPassword(password: string): string {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  }

  function verifyPassword(password: string, encoded: string): boolean {
    const [salt, expectedHex] = encoded.split(":");
    if (salt === undefined || expectedHex === undefined) return false;
    const actual = scryptSync(password, salt, 64);
    const expected = Buffer.from(expectedHex, "hex");
    return expected.length === actual.length && timingSafeEqual(actual, expected);
  }

  function digest(value: string): string {
    return createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("hex");
  }

  function encodeAccess(payload: { userId: string; sessionId: string; expiresAt: number }): string {
    const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    return `${body}.${signature}`;
  }

  function decodeAccess(value: string): { userId: string; sessionId: string; expiresAt: number } | null {
    const [body, signature] = value.split(".");
    if (body === undefined || signature === undefined) return null;
    const expected = createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(body).digest("base64url");
    if (signature.length !== expected.length || timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) === false) return null;
    try {
      const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
      if (
        typeof parsed !== "object" || parsed === null ||
        typeof (parsed as { userId?: unknown }).userId !== "string" ||
        typeof (parsed as { sessionId?: unknown }).sessionId !== "string" ||
        typeof (parsed as { expiresAt?: unknown }).expiresAt !== "number"
      ) return null;
      return parsed as { userId: string; sessionId: string; expiresAt: number };
    } catch {
      return null;
    }
  }
}
