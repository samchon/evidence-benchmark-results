import crypto from "node:crypto";
import type { IPage, IShoppingAdministratorRequest, IShoppingCustomer, IShoppingSeller } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { ShoppingAuthorityProvider } from "./ShoppingAuthorityProvider";

/** Owns administrator applications, grades, and account moderation. */
export namespace ShoppingAdminProvider {
  type Actor = ShoppingAuthorityProvider.IActor;
  interface RequestRow { id: string; actor_type: string; actor_id: string; reason: string; status: string; created_at: Date; decided_at: Date | null; }
  interface CustomerRow { id: string; email: string; login_status: string; display_name: string | null; phone_number: string | null; created_at: Date; }
  interface SellerRow { id: string; email: string; approval_status: string; login_status: string; suspended_at: Date | null; shop_name: string | null; shop_description: string | null; logo_image: string | null; created_at: Date; }

  export async function requestCreate(actor: Actor, input: IShoppingAdministratorRequest.ICreate): Promise<IShoppingAdministratorRequest> {
    await active(actor);
    if (await grade(actor, "regularAdministrator") || await grade(actor, "superAdministrator")) throw ErrorUtil.forbidden("An administrator cannot apply for another administrator grade.");
    if (await MyGlobal.prisma.shopping_administrator_requests.findFirst({ where: { actor_type: actor.type, actor_id: actor.id, status: "pending" } }) !== null) throw ErrorUtil.conflict("An administrator application is already pending.");
    return request(await MyGlobal.prisma.shopping_administrator_requests.create({ data: { id: crypto.randomUUID(), actor_type: actor.type, actor_id: actor.id, reason: input.reason, status: "pending", decided_by: null, created_at: new Date(), decided_at: null } }));
  }

  export async function assertRegular(actor: Actor): Promise<void> { await requireRegular(actor); }
  export async function assertSuper(actor: Actor): Promise<void> { await requireSuper(actor); }

  export async function requestIndex(actor: Actor, input: IPage.IRequest): Promise<IPage<IShoppingAdministratorRequest>> { const rows = await MyGlobal.prisma.shopping_administrator_requests.findMany({ where: { actor_type: actor.type, actor_id: actor.id }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(input, rows.map(request)); }
  export async function requestPending(actor: Actor, input: IPage.IRequest): Promise<IPage<IShoppingAdministratorRequest>> { await requireSuper(actor); const rows = await MyGlobal.prisma.shopping_administrator_requests.findMany({ where: { status: "pending" }, orderBy: [{ created_at: "asc" }, { id: "asc" }] }); return page(input, rows.map(request)); }

  export async function requestDecide(actor: Actor, id: string, input: IShoppingAdministratorRequest.IDecision): Promise<IShoppingAdministratorRequest> {
    await requireSuper(actor);
    const row = await MyGlobal.prisma.shopping_administrator_requests.findUnique({ where: { id } });
    if (row === null) throw ErrorUtil.notFound("The administrator application does not exist.");
    if (row.status !== "pending") throw ErrorUtil.conflict("The administrator application was already decided.");
    await active({ type: actorType(row.actor_type), id: row.actor_id });
    const status = input.approve ? "approved" : "rejected";
    const now = new Date();
    await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.shopping_administrator_requests.update({ where: { id }, data: { status, decided_by: actor.id, decided_at: now } });
      if (input.approve) await tx.shopping_administrator_grades.create({ data: { id: crypto.randomUUID(), actor_type: row.actor_type, actor_id: row.actor_id, grade: "regularAdministrator", created_at: now } });
    });
    return request(await MyGlobal.prisma.shopping_administrator_requests.findUniqueOrThrow({ where: { id } }));
  }

  export async function gradePromote(actor: Actor, targetId: string): Promise<IShoppingCustomer | IShoppingSeller> {
    await requireSuper(actor);
    const targetActor = await findTarget(targetId);
    if (targetActor.id === actor.id || !(await grade(targetActor, "regularAdministrator")) || await grade(targetActor, "superAdministrator")) throw ErrorUtil.forbidden("The target is not an eligible regular administrator.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_administrator_grades.create({ data: { id: crypto.randomUUID(), actor_type: targetActor.type, actor_id: targetActor.id, grade: "superAdministrator", created_at: new Date() } }), MyGlobal.prisma.shopping_administrator_grade_events.create({ data: { id: crypto.randomUUID(), actor_id: actor.id, target_type: targetActor.type, target_id: targetActor.id, action: "promotion", created_at: new Date() } })]);
    return account(targetActor);
  }

  export async function gradeDemote(actor: Actor, targetId: string): Promise<IShoppingCustomer | IShoppingSeller> {
    await requireSuper(actor);
    const targetActor = await findTarget(targetId);
    if (targetActor.id === actor.id || !(await grade(targetActor, "superAdministrator"))) throw ErrorUtil.forbidden("The target is not another super administrator.");
    await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_administrator_grades.delete({ where: { actor_type_actor_id_grade: { actor_type: targetActor.type, actor_id: targetActor.id, grade: "superAdministrator" } } }), MyGlobal.prisma.shopping_administrator_grade_events.create({ data: { id: crypto.randomUUID(), actor_id: actor.id, target_type: targetActor.type, target_id: targetActor.id, action: "demotion", created_at: new Date() } })]);
    return account(targetActor);
  }

  export async function customerIndex(actor: Actor, input: IPage.IRequest): Promise<IPage<IShoppingCustomer>> { await requireRegular(actor); const rows = await MyGlobal.prisma.shopping_customers.findMany({ where: { deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(input, await Promise.all(rows.map(async (row) => customer(row, await grades("customer", row.id))))); }
  export async function customerBan(actor: Actor, id: string): Promise<IShoppingCustomer> { await moderate(actor, "customer", id, "ban"); return customer(await MyGlobal.prisma.shopping_customers.update({ where: { id }, data: { login_status: "banned" } }), await grades("customer", id)); }
  export async function customerUnban(actor: Actor, id: string): Promise<IShoppingCustomer> { await moderate(actor, "customer", id, "unban"); return customer(await MyGlobal.prisma.shopping_customers.update({ where: { id }, data: { login_status: "active" } }), await grades("customer", id)); }
  export async function sellerIndex(actor: Actor, input: IPage.IRequest): Promise<IPage<IShoppingSeller>> { await requireRegular(actor); const rows = await MyGlobal.prisma.shopping_sellers.findMany({ where: { deleted_at: null }, orderBy: [{ created_at: "desc" }, { id: "desc" }] }); return page(input, await Promise.all(rows.map(async (row) => seller(row, await grades("seller", row.id))))); }
  export async function sellerBan(actor: Actor, id: string): Promise<IShoppingSeller> { await moderate(actor, "seller", id, "ban"); const row = await MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { login_status: "banned" } }); await MyGlobal.prisma.shopping_seller_sessions.updateMany({ where: { seller_id: id, revoked_at: null }, data: { revoked_at: new Date() } }); return seller(row, await grades("seller", id)); }
  export async function sellerUnban(actor: Actor, id: string): Promise<IShoppingSeller> { await moderate(actor, "seller", id, "unban"); const row = await MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { login_status: "active" } }); return seller(row, await grades("seller", id)); }
  export async function sellerSuspend(actor: Actor, id: string): Promise<IShoppingSeller> { await requireRegular(actor); if (actor.type === "seller" && actor.id === id) throw ErrorUtil.forbidden("An administrator cannot suspend its own identity."); const target = await findTarget(id); if (target.type !== "seller") throw ErrorUtil.notFound("The target identity does not exist."); if (await grade(target, "superAdministrator") && !(await grade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("A regular administrator cannot suspend a super administrator."); const row = await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } }); if (row.approval_status !== "approved" || row.suspended_at !== null) throw ErrorUtil.conflict("The seller is not eligible for suspension."); const now = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { suspended_at: now, updated_at: now } }), MyGlobal.prisma.shopping_moderation_events.create({ data: { id: crypto.randomUUID(), administrator_id: actor.id, target_type: "seller", target_id: id, action: "suspend", reason: "suspend", before_state: "active", after_state: "suspended", created_at: now } })]); return seller(await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } }), await grades("seller", id)); }
  export async function sellerUnsuspend(actor: Actor, id: string): Promise<IShoppingSeller> { await requireRegular(actor); const target = await findTarget(id); if (target.type !== "seller") throw ErrorUtil.notFound("The target identity does not exist."); if (await grade(target, "superAdministrator") && !(await grade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("A regular administrator cannot unsuspend a super administrator."); const row = await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } }); if (row.suspended_at === null) throw ErrorUtil.conflict("The seller is not suspended."); const now = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_sellers.update({ where: { id }, data: { suspended_at: null, updated_at: now } }), MyGlobal.prisma.shopping_moderation_events.create({ data: { id: crypto.randomUUID(), administrator_id: actor.id, target_type: "seller", target_id: id, action: "unsuspend", reason: "unsuspend", before_state: "suspended", after_state: "active", created_at: now } })]); return seller(await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } }), await grades("seller", id)); }

  async function requireRegular(actor: Actor) { await active(actor); if (!(await grade(actor, "regularAdministrator")) && !(await grade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("Administrator authority is required."); }
  async function requireSuper(actor: Actor) { await active(actor); if (!(await grade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("Super administrator authority is required."); }
  async function active(actor: Actor) { if (actor.type === "customer") { if (await MyGlobal.prisma.shopping_customers.findFirst({ where: { id: actor.id, deleted_at: null, login_status: "active" } }) === null) throw ErrorUtil.forbidden("The identity is unavailable."); } else if (await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id: actor.id, deleted_at: null, login_status: "active" } }) === null) throw ErrorUtil.forbidden("The identity is unavailable."); }
  async function grade(actor: Actor, value: string) { return (await MyGlobal.prisma.shopping_administrator_grades.findUnique({ where: { actor_type_actor_id_grade: { actor_type: actor.type, actor_id: actor.id, grade: value } } })) !== null; }
  async function grades(type: Actor["type"], id: string): Promise<string[]> { return (await MyGlobal.prisma.shopping_administrator_grades.findMany({ where: { actor_type: type, actor_id: id }, orderBy: { created_at: "asc" } })).map((row) => row.grade); }
  async function findTarget(id: string): Promise<Actor> { const customer = await MyGlobal.prisma.shopping_customers.findFirst({ where: { id, deleted_at: null } }); if (customer !== null) return { type: "customer", id }; const seller = await MyGlobal.prisma.shopping_sellers.findFirst({ where: { id, deleted_at: null } }); if (seller !== null) return { type: "seller", id }; throw ErrorUtil.notFound("The target identity does not exist."); }
  async function moderate(actor: Actor, type: Actor["type"], id: string, action: "ban" | "unban") { await requireRegular(actor); if (actor.type === type && actor.id === id) throw ErrorUtil.forbidden("An administrator cannot moderate its own identity."); const targetActor = await findTarget(id); if (targetActor.type !== type) throw ErrorUtil.notFound("The target identity does not exist."); if (await grade(targetActor, "superAdministrator") && !(await grade(actor, "superAdministrator"))) throw ErrorUtil.forbidden("A regular administrator cannot moderate a super administrator."); const before = type === "customer" ? (await MyGlobal.prisma.shopping_customers.findUniqueOrThrow({ where: { id } })).login_status : (await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id } })).login_status; const expected = action === "ban" ? "active" : "banned"; if (before !== expected) throw ErrorUtil.conflict(`The target is not ${expected}.`); const now = new Date(); await MyGlobal.prisma.$transaction([MyGlobal.prisma.shopping_moderation_events.create({ data: { id: crypto.randomUUID(), administrator_id: actor.id, target_type: type, target_id: id, action, reason: action, before_state: before, after_state: action === "ban" ? "banned" : "active", created_at: now } }), ...(type === "customer" && action === "ban" ? [MyGlobal.prisma.shopping_customer_sessions.updateMany({ where: { customer_id: id, revoked_at: null }, data: { revoked_at: now } })] : [])]); }
  async function account(actor: Actor): Promise<IShoppingCustomer | IShoppingSeller> { if (actor.type === "customer") return customer(await MyGlobal.prisma.shopping_customers.findUniqueOrThrow({ where: { id: actor.id } }), await grades(actor.type, actor.id)); return seller(await MyGlobal.prisma.shopping_sellers.findUniqueOrThrow({ where: { id: actor.id } }), await grades(actor.type, actor.id)); }
  function request(row: RequestRow): IShoppingAdministratorRequest { return { id: row.id, actorType: actorType(row.actor_type), actorId: row.actor_id, reason: row.reason, status: row.status, createdAt: row.created_at.toISOString(), decidedAt: row.decided_at?.toISOString() ?? null }; }
  function actorType(value: string): "customer" | "seller" { if (value === "customer" || value === "seller") return value; throw new Error(`Invalid actor type: ${value}`); }
  function customer(row: CustomerRow, gradeValues: string[]): IShoppingCustomer { return { id: row.id, email: row.email, loginStatus: row.login_status, displayName: row.display_name, phoneNumber: row.phone_number, createdAt: row.created_at.toISOString(), grades: gradeValues }; }
  function seller(row: SellerRow, gradeValues: string[]): IShoppingSeller { return { id: row.id, email: row.email, approvalStatus: row.approval_status, loginStatus: row.login_status, suspended: row.suspended_at !== null, shopName: row.shop_name, shopDescription: row.shop_description, logoImage: row.logo_image, createdAt: row.created_at.toISOString(), grades: gradeValues }; }
  function page<T extends object>(input: IPage.IRequest, rows: T[]): IPage<T> { const current = input.page ?? 1; const limit = input.limit ?? 100; const records = rows.length; const pages = limit === 0 ? (records === 0 ? 0 : 1) : Math.ceil(records / limit); return { pagination: { current, limit, records, pages }, data: limit === 0 ? rows : rows.slice((current - 1) * limit, current * limit) }; }
}
