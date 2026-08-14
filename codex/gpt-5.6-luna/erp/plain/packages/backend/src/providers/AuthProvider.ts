import type * as api from "@benchmark/erp-api";
import { ErrorUtil } from "../utils/ErrorUtil";
import { ErpPayload, hash } from "../decorators/ErpAuth";
import { MyGlobal } from "../MyGlobal";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

/** Authentication, organization context, and membership business rules. */
export namespace AuthProvider {
  /** Creates an organization, global identity, Owner membership, and baseline catalog. */
  export async function createOrganization(props: { body: api.IOrganization.ICreate }): Promise<api.IUser.IAuthorized & { organization: api.IOrganization }> {
    const existing = await MyGlobal.prisma.users.findUnique({ where: { email: props.body.email.toLowerCase() } });
    if (existing !== null) throw ErrorUtil.conflict("A user with this email already exists.");
    const now = new Date();
    const userId = randomUUID();
    const organizationId = randomUUID();
    const membershipId = randomUUID();
    const systemUserId = randomUUID();
    const systemMembershipId = randomUUID();
    const sessionId = randomUUID();
    const paymentTermId = randomUUID();
    const taxJurisdictionId = randomUUID();
    const warehouseId = randomUUID();
    const accessToken = randomBytes(32).toString("hex");
    const refreshToken = randomBytes(48).toString("hex");
    const passwordHash = password(props.body.password);
    const systemPasswordHash = password(randomBytes(32).toString("hex"));
    const baseCurrency = props.body.baseCurrency.toUpperCase();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.users.create({ data: { id: userId, email: props.body.email.toLowerCase(), password_hash: passwordHash, display_name: props.body.displayName, avatar: null, phone: null, locale: "en-US", timezone: props.body.timezone, status: "active", created_at: now, updated_at: now } });
      await tx.users.create({ data: { id: systemUserId, email: `system+${organizationId}@internal.invalid`, password_hash: systemPasswordHash, display_name: "System Automation", avatar: null, phone: null, locale: "en-US", timezone: props.body.timezone, status: "active", created_at: now, updated_at: now } });
      await tx.organizations.create({ data: { id: organizationId, name: props.body.name, base_currency: baseCurrency, timezone: props.body.timezone, fiscal_start_month: props.body.fiscalStartMonth, default_tax_jurisdiction_id: taxJurisdictionId, default_payment_term_id: paymentTermId, negative_stock_allowed: false, approval_threshold: 1000, status: "active", system_user_id: systemUserId, system_membership_id: systemMembershipId, created_at: now, updated_at: now } });
      await tx.memberships.create({ data: { id: membershipId, user_id: userId, organization_id: organizationId, status: "active", created_at: now, updated_at: now } });
      await tx.memberships.create({ data: { id: systemMembershipId, user_id: systemUserId, organization_id: organizationId, status: "active", created_at: now, updated_at: now } });
      const roles = ["Owner", "Finance Manager", "Procurement Manager", "Sales Manager", "Warehouse Manager", "Quality Manager", "HR Manager", "Production Manager", "Employee"];
      for (const [index, name] of roles.entries()) {
        const roleId = randomUUID();
        await tx.roles.create({ data: { id: roleId, organization_id: organizationId, name, builtin: true, permissions_json: JSON.stringify(name === "Owner" ? ["*"] : ["employee.self_service", name.toLowerCase().replaceAll(" ", ".")]), active: true, created_at: now } });
        if (index === 0) await tx.role_assignments.create({ data: { id: randomUUID(), membership_id: membershipId, role_id: roleId, created_at: now } });
        if (["Finance Manager", "Procurement Manager", "Production Manager"].includes(name)) await tx.role_assignments.create({ data: { id: randomUUID(), membership_id: systemMembershipId, role_id: roleId, created_at: now } });
      }
      await tx.currencies.create({ data: { id: randomUUID(), organization_id: organizationId, code: baseCurrency, name: baseCurrency, precision: 2, active: true, created_at: now } });
      await tx.units.create({ data: { id: randomUUID(), organization_id: organizationId, code: "EA", name: "Each", category: "quantity", active: true, created_at: now } });
      await tx.payment_terms.create({ data: { id: paymentTermId, organization_id: organizationId, name: "Due on receipt", due_days: 0, active: true, created_at: now, updated_at: now } });
      await tx.tax_jurisdictions.create({ data: { id: taxJurisdictionId, organization_id: organizationId, name: "Default", territory: "Default", active: true, created_at: now } });
      await tx.warehouses.create({ data: { id: warehouseId, organization_id: organizationId, code: "DEFAULT", name: "Default Warehouse", address_id: null, manager_id: null, valuation_policy: "standard", active: true, created_at: now, updated_at: now } });
      await tx.locations.create({ data: { id: randomUUID(), warehouse_id: warehouseId, code: "DEFAULT", name: "Default Location", description: null, parent_id: null, depth: 1, active: true, created_at: now } });
      for (const [code, name, type] of [["1000", "Cash", "asset"], ["1100", "Accounts Receivable", "asset"], ["1200", "Input Tax Receivable", "asset"], ["1300", "Inventory", "asset"], ["1600", "Accumulated Depreciation", "asset"], ["2000", "Accounts Payable", "liability"], ["2100", "Output Tax Payable", "liability"], ["3000", "Equity", "equity"], ["4000", "Revenue", "revenue"], ["5000", "Expense", "expense"], ["6000", "Cost of Goods Sold", "expense"]] as const)
        await tx.accounts.create({ data: { id: randomUUID(), organization_id: organizationId, code, name, type, parent_id: null, currency: baseCurrency, active: true, created_at: now, updated_at: now } });
      const currentYear = now.getUTCFullYear();
      const fiscalStartYear = now.getUTCMonth() + 1 < props.body.fiscalStartMonth ? currentYear - 1 : currentYear;
      const startsAt = new Date(Date.UTC(fiscalStartYear, props.body.fiscalStartMonth - 1, 1));
      const nextStartsAt = new Date(Date.UTC(fiscalStartYear + 1, props.body.fiscalStartMonth - 1, 1));
      await tx.fiscal_periods.create({ data: { id: randomUUID(), organization_id: organizationId, fiscal_year_id: null, name: `FY-${fiscalStartYear}`, starts_at: startsAt, ends_at: new Date(nextStartsAt.getTime() - 1), status: "open", close_cycle: 0, created_at: now } });
      for (const [documentType, prefix] of [["sales_order", "SO-"], ["purchase_order", "PO-"], ["sales_quote", "SQ-"], ["invoice", "INV-"], ["vendor_bill", "BILL-"], ["receipt", "GRN-"], ["shipment", "SHP-"]] as const)
        await tx.document_number_sequences.create({ data: { id: randomUUID(), organization_id: organizationId, document_type: documentType, prefix, padding: 6, next_value: 1, active: true, created_at: now, updated_at: now } });
      for (const targetType of ["purchase_order", "sales_order", "vendor_bill", "journal", "inventory_adjustment"])
        await tx.workflows.create({ data: { id: randomUUID(), organization_id: organizationId, target_type: targetType, priority: 0, status: "active", created_at: now, updated_at: now, conditions: "{}", steps: "[]", version: 1, base_workflow_id: null } });
      await tx.sessions.create({ data: { id: sessionId, user_id: userId, token_hash: hash(accessToken), refresh_token_hash: hash(refreshToken), membership_id: membershipId, expires_at: expiry("JWT_ACCESS_TTL_SECONDS"), refresh_expires_at: expiry("JWT_REFRESH_TTL_SECONDS"), revoked_at: null, created_at: now } });
      await tx.audit_events.create({ data: { id: randomUUID(), organization_id: organizationId, actor_id: membershipId, action: "organization.created", target_type: "organization", target_id: organizationId, risk: "high", before_value: null, after_value: JSON.stringify({ name: props.body.name }), reason: null, ip_address: null, user_agent: null, created_at: now } });
    });
    const user = await readUser(userId);
    return { user, accessToken, refreshToken, accessExpiresAt: expiry("JWT_ACCESS_TTL_SECONDS").toISOString(), memberships: await memberships(userId), organization: { id: organizationId, name: props.body.name, baseCurrency: baseCurrency, timezone: props.body.timezone, fiscalStartMonth: props.body.fiscalStartMonth, negativeStockAllowed: false, approvalThreshold: 1000, status: "active", createdAt: now.toISOString() } };
  }

  /** Authenticates an active global user without selecting organization data implicitly. */
  export async function login(props: { body: api.IUser.ILogin }): Promise<api.IUser.IAuthorized> {
    const user = await MyGlobal.prisma.users.findUnique({ where: { email: props.body.email.toLowerCase() } });
    if (user?.email.endsWith("@internal.invalid")) throw ErrorUtil.unauthorized("Invalid credentials or account eligibility.");
    if (user === null || user.status !== "active" || !verify(props.body.password, user.password_hash)) throw ErrorUtil.unauthorized("Invalid credentials or account eligibility.");
    const active = await MyGlobal.prisma.memberships.count({ where: { user_id: user.id, status: "active" } });
    if (active === 0) throw ErrorUtil.unauthorized("Invalid credentials or account eligibility.");
    return issue(user.id, null);
  }

  /** Rotates a live refresh credential and preserves its selected organization context. */
  export async function refresh(props: { body: api.IUser.IRefresh }): Promise<api.IUser.IAuthorized> {
    const now = new Date();
    const session = await MyGlobal.prisma.sessions.findFirst({ where: { refresh_token_hash: hash(props.body.refreshToken), revoked_at: null, refresh_expires_at: { gt: now } } });
    if (session === null) throw ErrorUtil.unauthorized("The refresh credential is invalid, expired, or revoked.");
    const user = await MyGlobal.prisma.users.findUnique({ where: { id: session.user_id } });
    if (user === null || user.status !== "active") throw ErrorUtil.unauthorized("The refresh credential is not eligible.");
    const activeMemberships = await MyGlobal.prisma.memberships.count({ where: { user_id: user.id, status: "active" } });
    if (activeMemberships === 0) throw ErrorUtil.unauthorized("The refresh credential is not eligible.");
    const accessToken = randomBytes(32).toString("hex");
    const refreshToken = randomBytes(48).toString("hex");
    const accessExpiresAt = expiry("JWT_ACCESS_TTL_SECONDS");
    const refreshExpiresAt = expiry("JWT_REFRESH_TTL_SECONDS");
    const changed = await MyGlobal.prisma.sessions.updateMany({ where: { id: session.id, refresh_token_hash: hash(props.body.refreshToken), revoked_at: null, refresh_expires_at: { gt: now } }, data: { token_hash: hash(accessToken), refresh_token_hash: hash(refreshToken), expires_at: accessExpiresAt, refresh_expires_at: refreshExpiresAt } });
    if (changed.count !== 1) throw ErrorUtil.unauthorized("The refresh credential was already rotated.");
    return { user: await readUser(user.id), accessToken, refreshToken, accessExpiresAt: accessExpiresAt.toISOString(), memberships: await memberships(user.id) };
  }

  /** Accepts a valid owner-issued invitation and creates or reuses the global identity. */
  export async function acceptInvitation(props: { body: api.IUser.IAcceptInvitation }): Promise<api.IUser.IAuthorized> {
    const delivery = await MyGlobal.prisma.invitation_deliveries.findFirst({ where: { token_hash: hash(props.body.token), email: props.body.email.toLowerCase(), status: { in: ["queued", "delivered"] } } });
    if (delivery === null) throw ErrorUtil.unprocessable("The invitation is invalid, expired, revoked, or bound to another email.");
    const invitation = await MyGlobal.prisma.invitations.findFirst({ where: { id: delivery.invitation_id, token_hash: delivery.token_hash, email: delivery.email, status: "pending", expires_at: { gt: new Date() } } });
    if (invitation === null) throw ErrorUtil.unprocessable("The invitation is invalid, expired, revoked, or bound to another email.");
    const now = new Date();
    const user = await MyGlobal.prisma.users.findUnique({ where: { email: props.body.email.toLowerCase() } });
    if (user !== null && user.status !== "active") throw ErrorUtil.conflict("This account must be active before accepting an invitation.");
    const userId = user?.id ?? randomUUID();
    await MyGlobal.prisma.$transaction(async (tx) => {
      if (user === null) await tx.users.create({ data: { id: userId, email: props.body.email.toLowerCase(), password_hash: password(props.body.password), display_name: props.body.displayName, avatar: null, phone: null, locale: "en-US", timezone: "UTC", status: "active", created_at: now, updated_at: now } });
      const prior = await tx.memberships.findUnique({ where: { user_id_organization_id: { user_id: userId, organization_id: invitation.organization_id } } });
      if (prior !== null) throw ErrorUtil.conflict("This user already has a membership in the organization.");
      const membershipId = randomUUID();
      await tx.memberships.create({ data: { id: membershipId, user_id: userId, organization_id: invitation.organization_id, status: "active", created_at: now, updated_at: now } });
      const role = await tx.roles.findFirst({ where: { organization_id: invitation.organization_id, name: invitation.role_name, active: true } });
      if (role === null) throw ErrorUtil.conflict("The invitation role is no longer active.");
      await tx.role_assignments.create({ data: { id: randomUUID(), membership_id: membershipId, role_id: role.id, created_at: now } });
      await tx.invitations.update({ where: { id: invitation.id }, data: { status: "accepted", accepted_at: now } });
      await tx.invitation_deliveries.update({ where: { id: delivery.id }, data: { status: "consumed", consumed_at: now, delivered_at: delivery.delivered_at ?? now, attempts: { increment: 1 } } });
    });
    return issue(userId, null);
  }

  /** Selects an active membership as the operating organization. */
  export async function selectMembership(props: { actor: ErpPayload; membershipId: string }): Promise<api.IMembership> {
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: props.membershipId, user_id: props.actor.id, status: "active" } });
    if (membership === null) throw ErrorUtil.forbidden("Only an active membership may be selected.");
    await MyGlobal.prisma.sessions.update({ where: { id: props.actor.session_id }, data: { membership_id: membership.id } });
    return membershipDto(membership, await roleNames(membership.id));
  }

  /** Revokes only the current session. */
  export async function logout(props: { actor: ErpPayload }): Promise<api.IEntity> { await MyGlobal.prisma.sessions.update({ where: { id: props.actor.session_id }, data: { revoked_at: new Date() } }); return { id: props.actor.session_id }; }
  /** Revokes every active session of the global user. */
  export async function logoutAll(props: { actor: ErpPayload }): Promise<api.IEntity> { await MyGlobal.prisma.sessions.updateMany({ where: { user_id: props.actor.id, revoked_at: null }, data: { revoked_at: new Date() } }); return { id: props.actor.session_id }; }
  /** Reads the self profile. */
  export async function profile(props: { actor: ErpPayload }): Promise<api.IUser> { return readUser(props.actor.id); }
  /** Updates only self-service profile fields. */
  export async function updateProfile(props: { actor: ErpPayload; body: api.IUser.IUpdate }): Promise<api.IUser> { await MyGlobal.prisma.users.update({ where: { id: props.actor.id }, data: { display_name: props.body.displayName ?? undefined, avatar: props.body.avatar === undefined ? undefined : props.body.avatar, phone: props.body.phone === undefined ? undefined : props.body.phone, locale: props.body.locale ?? undefined, timezone: props.body.timezone ?? undefined, updated_at: new Date() } }); return readUser(props.actor.id); }
  /** Changes the signed-in user's password and preserves only the completing session. */
  export async function changePassword(props: { actor: ErpPayload; body: api.IUser.IChangePassword }): Promise<api.IEntity> { const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: props.actor.id } }); if (!verify(props.body.currentPassword, user.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect."); await MyGlobal.prisma.$transaction(async (tx) => { await tx.users.update({ where: { id: user.id }, data: { password_hash: password(props.body.newPassword), updated_at: new Date() } }); await tx.sessions.updateMany({ where: { user_id: user.id, id: { not: props.actor.session_id }, revoked_at: null }, data: { revoked_at: new Date() } }); }); return { id: user.id }; }
  /** Deactivates the global account after current-password verification. */
  export async function deactivateAccount(props: { actor: ErpPayload; body: { currentPassword: string } }): Promise<api.IEntity> { const user = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id: props.actor.id } }); if (!verify(props.body.currentPassword, user.password_hash)) throw ErrorUtil.unauthorized("The current password is incorrect."); await MyGlobal.prisma.$transaction(async (tx) => { await tx.users.update({ where: { id: user.id }, data: { status: "deactivated", updated_at: new Date() } }); await tx.sessions.updateMany({ where: { user_id: user.id, revoked_at: null }, data: { revoked_at: new Date() } }); }); return { id: user.id }; }
  /** Queues an email-bound recovery proof without disclosing account existence. */
  export async function recoveryRequest(props: { body: api.IUser.IRecoveryRequest }): Promise<api.IEntity> { const email = props.body.email.toLowerCase(); const user = await MyGlobal.prisma.users.findUnique({ where: { email } }); if (user !== null) { const token = randomBytes(32).toString("hex"); await MyGlobal.prisma.recovery_deliveries.create({ data: { id: randomUUID(), user_id: user.id, email, token_hash: hash(token), status: "pending", expires_at: new Date(Date.now() + 15 * 60 * 1000), created_at: new Date(), consumed_at: null } }); } return { id: randomUUID() }; }
  /** Completes a single-use recovery proof and reactivates the global account. */
  export async function recoveryComplete(props: { body: api.IUser.IRecoveryComplete }): Promise<api.IUser.IAuthorized> { const email = props.body.email.toLowerCase(); const delivery = await MyGlobal.prisma.recovery_deliveries.findFirst({ where: { email, token_hash: hash(props.body.token), status: "pending", expires_at: { gt: new Date() } } }); if (delivery === null) throw ErrorUtil.unprocessable("The recovery proof is invalid, expired, consumed, or bound to another email."); const now = new Date(); await MyGlobal.prisma.$transaction(async (tx) => { const claimed = await tx.recovery_deliveries.updateMany({ where: { id: delivery.id, user_id: delivery.user_id, status: "pending", expires_at: { gt: now } }, data: { status: "consuming" } }); if (claimed.count !== 1) throw ErrorUtil.unprocessable("The recovery proof is invalid, expired, consumed, or bound to another email."); await tx.users.update({ where: { id: delivery.user_id }, data: { password_hash: password(props.body.newPassword), status: "active", updated_at: now } }); await tx.recovery_deliveries.update({ where: { id: delivery.id }, data: { status: "consumed", consumed_at: now } }); await tx.sessions.updateMany({ where: { user_id: delivery.user_id, revoked_at: null }, data: { revoked_at: now } }); }); return issue(delivery.user_id, null); }
  /** Requires an active selected membership and returns its organization id. */
  export async function organizationId(actor: ErpPayload): Promise<string> { if (actor.membership_id === null) throw ErrorUtil.forbidden("Select an active organization before operational work."); const m = await MyGlobal.prisma.memberships.findFirst({ where: { id: actor.membership_id, user_id: actor.id, status: "active" } }); if (m === null) throw ErrorUtil.forbidden("The selected organization membership is no longer active."); return m.organization_id; }

  async function issue(userId: string, membershipId: string | null): Promise<api.IUser.IAuthorized> { const token = randomBytes(32).toString("hex"); const refreshToken = randomBytes(48).toString("hex"); const session = await MyGlobal.prisma.sessions.create({ data: { id: randomUUID(), user_id: userId, token_hash: hash(token), refresh_token_hash: hash(refreshToken), membership_id: membershipId, expires_at: expiry("JWT_ACCESS_TTL_SECONDS"), refresh_expires_at: expiry("JWT_REFRESH_TTL_SECONDS"), revoked_at: null, created_at: new Date() } }); return { user: await readUser(userId), accessToken: token, refreshToken, accessExpiresAt: session.expires_at.toISOString(), memberships: await memberships(userId) }; }
  async function readUser(id: string): Promise<api.IUser> { const row = await MyGlobal.prisma.users.findUniqueOrThrow({ where: { id } }); return { id: row.id, email: row.email, displayName: row.display_name, avatar: row.avatar, phone: row.phone, locale: row.locale, timezone: row.timezone, status: row.status as api.IUser["status"] }; }
  async function memberships(userId: string): Promise<api.IMembership.ISummary[]> { const rows = await MyGlobal.prisma.memberships.findMany({ where: { user_id: userId }, orderBy: { created_at: "asc" } }); return Promise.all(rows.map(async (row) => membershipDto(row, await roleNames(row.id)))); }
  /** Returns only currently effective roles; inactive role definitions lose access immediately. */
  export async function hasAnyRole(actor: ErpPayload, names: readonly string[]): Promise<boolean> {
    if (actor.membership_id === null || names.length === 0) return false;
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: actor.membership_id, user_id: actor.id, status: "active" } });
    if (membership === null) return false;
    const assignments = await MyGlobal.prisma.role_assignments.findMany({ where: { membership_id: membership.id } });
    const roles = await MyGlobal.prisma.roles.findMany({ where: { id: { in: assignments.map((assignment) => assignment.role_id) }, organization_id: membership.organization_id, active: true }, select: { name: true, permissions_json: true } });
    const expectedPermissions = new Set(names.map((name) => name.toLowerCase().replaceAll(" ", ".")));
    return roles.some((role) => {
      if (names.includes(role.name)) return true;
      try {
        const permissions = JSON.parse(role.permissions_json) as string[];
        return permissions.includes("*") || permissions.some((permission) => expectedPermissions.has(permission));
      } catch {
        return false;
      }
    });
  }
  export async function hasPermission(actor: ErpPayload, permission: string): Promise<boolean> {
    if (actor.membership_id === null) return false;
    const membership = await MyGlobal.prisma.memberships.findFirst({ where: { id: actor.membership_id, user_id: actor.id, status: "active" } });
    if (membership === null) return false;
    const assignments = await MyGlobal.prisma.role_assignments.findMany({ where: { membership_id: membership.id } });
    const roles = await MyGlobal.prisma.roles.findMany({ where: { id: { in: assignments.map((assignment) => assignment.role_id) }, organization_id: membership.organization_id, active: true }, select: { name: true, permissions_json: true } });
    return roles.some((role) => {
      try {
        return role.name === "Owner" || (JSON.parse(role.permissions_json) as string[]).some((candidate) => candidate === "*" || candidate === permission);
      } catch {
        return role.name === "Owner";
      }
    });
  }
  export async function requirePermission(actor: ErpPayload, permission: string, message: string): Promise<void> { if (!(await hasPermission(actor, permission))) throw ErrorUtil.forbidden(message); }
  export async function requireAnyRole(actor: ErpPayload, names: readonly string[], message: string): Promise<void> { if (!(await hasAnyRole(actor, names))) throw ErrorUtil.forbidden(message); }
  async function roleNames(id: string): Promise<string[]> { const rows = await MyGlobal.prisma.role_assignments.findMany({ where: { membership_id: id } }); const roles = await MyGlobal.prisma.roles.findMany({ where: { id: { in: rows.map((row) => row.role_id) }, active: true } }); return roles.map((role) => role.name); }
  function membershipDto(row: { id: string; organization_id: string; status: string }, roles: string[]): api.IMembership { return { id: row.id, organizationId: row.organization_id, status: row.status as api.IMembership["status"], roles }; }
  function expiry(key: "JWT_ACCESS_TTL_SECONDS" | "JWT_REFRESH_TTL_SECONDS"): Date { return new Date(Date.now() + Number(MyGlobal.env[key]) * 1000); }
  function password(value: string): string { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(value, salt, 64).toString("hex")}`; }
  function verify(value: string, stored: string): boolean { const [salt, digest] = stored.split(":"); if (salt === undefined || digest === undefined) return false; const expected = scryptSync(value, salt, 64); const actual = Buffer.from(digest, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
}
