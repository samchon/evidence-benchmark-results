import { createParamDecorator, type ExecutionContext, Injectable, type CanActivate } from "@nestjs/common";
import type { Request } from "express";
import { createHmac } from "node:crypto";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** The authenticated request actor. */
export interface ErpPayload {
  /** Global user identifier. */
  id: string;
  /** Current session identifier. */
  session_id: string;
  /** Selected active membership, when context has been chosen. */
  membership_id: string | null;
}

/** Resolves the bearer actor from the live database session. */
@Injectable()
export class ErpAuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const header: string | undefined = request.header("authorization");
    const token: string | undefined = header?.startsWith("Bearer ")
      ? header.slice(7)
      : undefined;
    if (token === undefined || token.length < 16)
      throw ErrorUtil.unauthorized("A valid bearer session is required.");
    const session = await MyGlobal.prisma.sessions.findFirst({
      where: { token_hash: hash(token), revoked_at: null },
    });
    if (
      session === null ||
      session.expires_at <= new Date()
    )
      throw ErrorUtil.unauthorized("The session is expired or revoked.");
    const user = await MyGlobal.prisma.users.findUnique({ where: { id: session.user_id } });
    if (user === null || user.status !== "active")
      throw ErrorUtil.unauthorized("The account is inactive.");
    await enforceRouteAuthority(request.path, request.method, session.membership_id, user.id);
    (request as Request & { user: unknown }).user = {
      id: user.id,
      session_id: session.id,
      membership_id: session.membership_id,
    };
    return true;
  }
}

/**
 * Applies the organization role boundary at the HTTP boundary as well as in
 * providers.  Keeping this check here prevents a newly added provider route
 * from accidentally becoming an unscoped role bypass.
 */
async function enforceRouteAuthority(
  path: string,
  method: string,
  membershipId: string | null,
  userId: string,
): Promise<void> {
  if (!path.startsWith("/erp/") || path.startsWith("/erp/auth")) return;
  if (membershipId === null)
    throw ErrorUtil.forbidden("Select an active organization before operational work.");
  const membership = await MyGlobal.prisma.memberships.findFirst({
    where: { id: membershipId, user_id: userId, status: "active" },
  });
  if (membership === null)
    throw ErrorUtil.forbidden("The selected organization membership is no longer active.");
  const assignments = await MyGlobal.prisma.role_assignments.findMany({
    where: { membership_id: membership.id },
    select: { role_id: true },
  });
  const roles = await MyGlobal.prisma.roles.findMany({
    where: {
      id: { in: assignments.map((row) => row.role_id) },
      organization_id: membership.organization_id,
      active: true,
    },
    select: { name: true, permissions_json: true },
  });
  const allowed = routeRoles(path, method);
  if (allowed === null)
    throw ErrorUtil.forbidden("The ERP route has no declared organization authority.");
  if (roles.some((role) => role.name === "Owner")) return;
  const effective = new Set(
    roles.flatMap((role) => {
      try {
        return JSON.parse(role.permissions_json) as string[];
      } catch {
        return [];
      }
    }),
  );
  if (
    effective.has("*") ||
    roles.some((role) => allowed.includes(role.name)) ||
    allowed.some((role) => effective.has(role.toLowerCase().replaceAll(" ", ".")))
  )
    return;
  throw ErrorUtil.forbidden("The selected organization role cannot access this operation.");
}

function routeRoles(path: string, method: string): string[] | null {
  if (path.startsWith("/erp/organization/role")) return ["Owner"];
  if (path.startsWith("/erp/organization/membership")) return ["Owner"];
  if (path.startsWith("/erp/organization/invitation")) return ["Owner"];
  if (path.startsWith("/erp/organization")) return ["Owner"];
  if (path.startsWith("/erp/custom-field")) return ["Owner"];
  if (path.startsWith("/erp/control/report")) return ["Owner", "Finance Manager", "Procurement Manager", "Sales Manager", "Warehouse Manager", "Production Manager", "Quality Manager", "HR Manager", "report.read"];
  if (path.startsWith("/erp/control/audit")) return ["Owner", "Finance Manager", "audit.read"];
  if (path.startsWith("/erp/control-ops/workflow")) return ["Owner"];
  if (path.startsWith("/erp/control-ops/period/") && path.endsWith("/reopen-request")) return ["Owner"];
  if (path.startsWith("/erp/control-ops/approval")) return ["Owner", "Finance Manager", "Procurement Manager", "Sales Manager", "Warehouse Manager", "HR Manager", "Production Manager", "Employee"];
  if (path.startsWith("/erp/address") || path.startsWith("/erp/contact") || path.startsWith("/erp/party")) return ["Owner", "Finance Manager", "Procurement Manager", "Sales Manager"];
  if (path.startsWith("/erp/item") || path.startsWith("/erp/unit")) return ["Owner", "Procurement Manager", "Sales Manager", "Warehouse Manager", "Production Manager"];
  if (path.startsWith("/erp/warehouse") || path.startsWith("/erp/location")) return ["Owner", "Warehouse Manager", "Production Manager"];
  if (path.startsWith("/erp/sales-finance")) return ["Sales Manager", "Finance Manager"];
  if (path.startsWith("/erp/account") || path.startsWith("/erp/journal") || path.startsWith("/erp/financial-center") || path.startsWith("/erp/depreciation") || path.startsWith("/erp/tax-return")) return ["Finance Manager"];
  if (path.startsWith("/erp/control-ops/automation")) return ["Owner", "Finance Manager"];
  if (path.startsWith("/erp/control-ops") || path.startsWith("/erp/bank")) return ["Finance Manager"];
  if (path.startsWith("/erp/payroll-setup")) return ["HR Manager", "Finance Manager"];
  if (path.startsWith("/erp/workforce/payslip") || path.startsWith("/erp/workforce/timelog") || path.startsWith("/erp/workforce/timesheet")) return ["Employee", "employee.self_service", "HR Manager", "Finance Manager"];
  if (path.startsWith("/erp/workforce/employee")) return ["Employee", "employee.self_service", "HR Manager"];
  if (path.startsWith("/erp/workforce")) return ["HR Manager", "Finance Manager"];
  if (path.startsWith("/erp/purchase/request")) return ["Employee", "employee.self_service", "Procurement Manager"];
  if (path.startsWith("/erp/purchase/order") && method === "POST") return ["Procurement Manager", "purchase.direct"];
  if (path.startsWith("/erp/purchase")) return ["Procurement Manager"];
  if (path.startsWith("/erp/vendor-credit")) return ["Procurement Manager", "Finance Manager"];
  if (path.startsWith("/erp/sales-price") || path.startsWith("/erp/sales-quote") || path.startsWith("/erp/sales")) return ["Sales Manager"];
  if (path.startsWith("/erp/inventory") || path.startsWith("/erp/stock") || path.startsWith("/erp/allocation") || path.startsWith("/erp/quarantine")) return ["Warehouse Manager", "Sales Manager", "Quality Manager"];
  if (path.startsWith("/erp/operations") || path.startsWith("/erp/manufacturing-resource") || path.startsWith("/erp/mrp") || path.startsWith("/erp/quality-maintenance-plan")) return ["Production Manager", "Quality Manager", "Warehouse Manager", "Finance Manager", "Maintenance Manager", "Service Manager"];
  if (path.startsWith("/erp/service-order")) return ["Sales Manager", "Employee", "employee.self_service"];
  if (path.startsWith("/erp/projects")) return ["HR Manager", "Employee", "employee.self_service"];
  if (path.startsWith("/erp/config")) return ["Finance Manager"];
  if (path.startsWith("/erp/extended-finance")) return ["Finance Manager", "Procurement Manager", "Sales Manager"];
  if (path.startsWith("/erp/interaction")) return ["Employee", "employee.self_service", "HR Manager", "Finance Manager", "Procurement Manager", "Sales Manager", "Production Manager"];
  if (path.startsWith("/erp/allocation-rule")) return ["Finance Manager"];
  if (path.startsWith("/erp/config-ext")) return ["Finance Manager"];
  return null;
}

/** Typed controller parameter for the authenticated ERP actor. */
export const ErpAuth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): ErpPayload => {
    const request: Request = context.switchToHttp().getRequest<Request>();
    return (request as Request & { user: unknown }).user as ErpPayload;
  },
);

/** Hashes opaque session proofs before persistence. */
export function hash(value: string): string {
  return createHmac("sha256", MyGlobal.env.JWT_SECRET_KEY).update(value).digest("hex");
}
