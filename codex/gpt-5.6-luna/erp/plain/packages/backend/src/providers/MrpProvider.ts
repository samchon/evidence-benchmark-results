import type * as api from "@benchmark/erp-api";
import { randomUUID } from "node:crypto";
import { AuthProvider } from "./AuthProvider";
import { DocumentNumberService } from "./DocumentNumberService";
import type { ErpPayload } from "../decorators/ErpAuth";
import { ErrorUtil } from "../utils/ErrorUtil";
import { MyGlobal } from "../MyGlobal";

/** Organization-scoped material-requirements planning and recommendation actions. */
export namespace MrpProvider {
  export async function runCreate(p: { actor: ErpPayload; body: api.IMrpRun.ICreate }): Promise<api.IMrpRun> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Production Manager"], "Only a Production Manager may run MRP.");
    const horizonFrom = new Date(p.body.horizonFrom);
    const horizonTo = new Date(p.body.horizonTo);
    if (!Number.isFinite(horizonFrom.getTime()) || !Number.isFinite(horizonTo.getTime()) || horizonTo <= horizonFrom) throw ErrorUtil.badRequest("MRP horizon must end after it starts.");
    const [items, salesOrders, purchaseOrders, productionOrders, movements, warehouses, organization] = await Promise.all([
      MyGlobal.prisma.items.findMany({ where: { organization_id: organizationId, active: true, type: { not: "service" } } }),
      MyGlobal.prisma.sales_orders.findMany({ where: { organization_id: organizationId, status: { notIn: ["cancelled", "closed", "shipped"] }, created_at: { lte: horizonTo } }, select: { id: true } }),
      MyGlobal.prisma.purchase_orders.findMany({ where: { organization_id: organizationId, status: { notIn: ["cancelled", "closed"] }, created_at: { lte: horizonTo } }, select: { id: true } }),
      MyGlobal.prisma.production_orders.findMany({ where: { organization_id: organizationId, status: { in: ["draft", "released", "in_progress", "completed", "approved"] }, created_at: { lte: horizonTo } }, select: { finished_item_id: true, planned_quantity: true, completed_quantity: true, scrap_quantity: true } }),
      MyGlobal.prisma.stock_movements.findMany({ where: { organization_id: organizationId, created_at: { lte: horizonTo } }, select: { item_id: true, quantity: true } }),
      MyGlobal.prisma.warehouses.findMany({ where: { organization_id: organizationId, active: true }, select: { id: true } }),
      MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } }),
    ]);
    const [sales, purchases] = await Promise.all([
      MyGlobal.prisma.sales_order_lines.findMany({ where: { order_id: { in: salesOrders.map((row) => row.id) } }, select: { id: true, order_id: true, item_id: true, ordered_quantity: true, shipped_quantity: true } }),
      MyGlobal.prisma.purchase_order_lines.findMany({ where: { order_id: { in: purchaseOrders.map((row) => row.id) } }, select: { item_id: true, ordered_quantity: true, received_quantity: true } }),
    ]);
    const demand = new Map<string, number>();
    const forecast = new Map<string, number>();
    for (const row of p.body.forecasts ?? []) {
      if (!Number.isFinite(row.quantity) || row.quantity < 0) throw ErrorUtil.unprocessable("Forecast quantities must be finite and non-negative.");
      if (items.find((candidate) => candidate.id === row.itemId) === undefined) throw ErrorUtil.notFound("Every MRP forecast item must be active in the organization.");
      const requiredDate = row.requiredDate === undefined || row.requiredDate === null ? horizonTo : new Date(String(row.requiredDate));
      if (!Number.isFinite(requiredDate.getTime()) || requiredDate < horizonFrom || requiredDate > horizonTo) throw ErrorUtil.unprocessable("Forecast dates must fall inside the MRP horizon.");
      forecast.set(row.itemId, (forecast.get(row.itemId) ?? 0) + row.quantity);
    }
    for (const row of sales) demand.set(row.item_id, (demand.get(row.item_id) ?? 0) + Math.max(0, row.ordered_quantity - row.shipped_quantity));
    for (const [itemId, quantity] of forecast) demand.set(itemId, (demand.get(itemId) ?? 0) + quantity);
    const supply = new Map<string, number>();
    for (const row of purchases) supply.set(row.item_id, (supply.get(row.item_id) ?? 0) + Math.max(0, row.ordered_quantity - row.received_quantity));
    const production = new Map<string, number>();
    for (const row of productionOrders) production.set(row.finished_item_id, (production.get(row.finished_item_id) ?? 0) + Math.max(0, row.planned_quantity - row.completed_quantity - row.scrap_quantity));
    const onHand = new Map<string, number>();
    for (const row of movements) onHand.set(row.item_id, (onHand.get(row.item_id) ?? 0) + row.quantity);
    const recommendations: Array<{ id: string; organization_id: string; run_id: string; recommendation_type: string; item_id: string; warehouse_id: string | null; quantity: number; required_date: Date; source_demand_id: string | null; status: string; rationale: string; linked_document_id: string | null; decision_actor: string | null; decision_reason: string | null; decision_at: Date | null; created_at: Date; updated_at: Date }> = [];
    let shortageQuantity = 0;
    let safetyStockQuantity = 0;
    const createdAt = new Date();
    const runId = randomUUID();
    for (const item of items) {
      safetyStockQuantity += item.safety_stock;
      const shortage = Math.max(0, (demand.get(item.id) ?? 0) + item.safety_stock - (supply.get(item.id) ?? 0) - (production.get(item.id) ?? 0) - (onHand.get(item.id) ?? 0));
      if (shortage <= 0) continue;
      shortageQuantity += shortage;
      const multiple = item.order_multiple > 0 ? item.order_multiple : 1;
      const quantity = Math.max(item.minimum_order_quantity, Math.ceil(shortage / multiple) * multiple);
      const recommendationType = item.make_or_buy === "make" ? "planned_production" : "planned_purchase";
      recommendations.push({ id: randomUUID(), organization_id: organizationId, run_id: runId, recommendation_type: recommendationType, item_id: item.id, warehouse_id: item.default_warehouse_id ?? warehouses[0]?.id ?? null, quantity, required_date: horizonTo, source_demand_id: null, status: "open", rationale: `Demand ${demand.get(item.id) ?? 0} plus safety stock ${item.safety_stock} exceeds purchase supply ${supply.get(item.id) ?? 0}, production supply ${production.get(item.id) ?? 0}, and on-hand ${onHand.get(item.id) ?? 0}.`, linked_document_id: null, decision_actor: null, decision_reason: null, decision_at: null, created_at: createdAt, updated_at: createdAt });
    }
    const snapshot = { items: items.length, demandQuantity: sum(demand) - sum(forecast), forecastQuantity: sum(forecast), supplyQuantity: sum(supply), productionQuantity: sum(production), onHandQuantity: sum(onHand), safetyStockQuantity, recommendationCount: recommendations.length };
    const run = await MyGlobal.prisma.$transaction(async (tx) => {
      await tx.mrp_runs.create({ data: { id: runId, organization_id: organizationId, horizon_from: horizonFrom, horizon_to: horizonTo, trigger_type: p.body.triggerType ?? "manual", initiated_by: p.actor.id, input_snapshot: JSON.stringify(snapshot), status: "completed", summary: JSON.stringify({ shortageQuantity, recommendationCount: recommendations.length, baseCurrency: organization.base_currency }), created_at: createdAt } });
      if (recommendations.length > 0) await tx.mrp_recommendations.createMany({ data: recommendations });
      return tx.mrp_runs.findUniqueOrThrow({ where: { id: runId } });
    });
    return runMap(run);
  }

  export async function runIndex(p: { actor: ErpPayload; input: api.IPage.IRequest }): Promise<api.IPage<api.IMrpRun>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId };
    const [rows, records] = await Promise.all([MyGlobal.prisma.mrp_runs.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { created_at: "desc" } }), MyGlobal.prisma.mrp_runs.count({ where })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(runMap) };
  }

  export async function recommendationIndex(p: { actor: ErpPayload; runId: string; input: api.IPage.IRequest & { status?: api.IMrpRecommendation["status"] } }): Promise<api.IPage<api.IMrpRecommendation>> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    if (await MyGlobal.prisma.mrp_runs.findFirst({ where: { id: p.runId, organization_id: organizationId } }) === null) throw ErrorUtil.notFound("No MRP run exists in the active organization.");
    const page = p.input.page ?? 1;
    const limit = p.input.limit || 100;
    const where = { organization_id: organizationId, run_id: p.runId, ...(p.input.status === undefined ? {} : { status: p.input.status }) };
    const [rows, records] = await Promise.all([MyGlobal.prisma.mrp_recommendations.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { required_date: "asc" } }), MyGlobal.prisma.mrp_recommendations.count({ where })]);
    return { pagination: { current: page, limit, records, pages: Math.ceil(records / limit) }, data: rows.map(recommendationMap) };
  }

  export async function recommendationState(p: { actor: ErpPayload; id: string; status: "accepted" | "dismissed" }): Promise<api.IMrpRecommendation> {
    if (p.status === "dismissed") return dismiss({ actor: p.actor, id: p.id, reason: "Dismissed from the recommendation state command." });
    const row = await recommendation(p.actor, p.id);
    return row.recommendation_type === "planned_production" ? acceptProduction({ actor: p.actor, id: p.id }) : acceptPurchase({ actor: p.actor, id: p.id });
  }

  export async function acceptPurchase(p: { actor: ErpPayload; id: string }): Promise<api.IMrpRecommendation> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Procurement Manager"], "Only a Procurement Manager may accept a purchase recommendation.");
    const row = await recommendation(p.actor, p.id);
    if (row.status !== "open") throw ErrorUtil.conflict("Only an open MRP recommendation can be accepted.");
    if (row.recommendation_type !== "planned_purchase") throw ErrorUtil.conflict("Only a planned-purchase recommendation can create a purchase order.");
    const [item, organization] = await Promise.all([MyGlobal.prisma.items.findFirst({ where: { id: row.item_id, organization_id: organizationId, active: true } }), MyGlobal.prisma.organizations.findUniqueOrThrow({ where: { id: organizationId }, select: { base_currency: true } })]);
    const vendor = item === null ? null : await MyGlobal.prisma.parties.findFirst({ where: { id: item.preferred_vendor_id ?? "", organization_id: organizationId, kind: "vendor", status: "active" } }) ?? await MyGlobal.prisma.parties.findFirst({ where: { organization_id: organizationId, kind: "vendor", status: "active" }, orderBy: { created_at: "asc" } });
    if (item === null || vendor === null) throw ErrorUtil.conflict("The recommendation has no active vendor.");
    const number = await DocumentNumberService.next(organizationId, "purchase_order");
    const now = new Date();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const claimed = await tx.mrp_recommendations.updateMany({ where: { id: row.id, organization_id: organizationId, status: "open" }, data: { status: "accepted", decision_actor: p.actor.membership_id!, decision_at: now, updated_at: now } });
      if (claimed.count !== 1) throw ErrorUtil.conflict("The recommendation was already decided.");
      const order = await tx.purchase_orders.create({ data: { id: randomUUID(), organization_id: organizationId, vendor_id: vendor.id, number, status: "draft", currency: organization.base_currency, payment_term_id: null, source_request_id: null, mrp_recommendation_id: row.id, mrp_run_id: row.run_id, created_at: now, updated_at: now } });
      await tx.purchase_order_lines.create({ data: { id: randomUUID(), order_id: order.id, source_request_line_id: null, item_id: item.id, ordered_quantity: row.quantity, received_quantity: 0, billed_quantity: 0, unit_price: item.purchase_price, unit_id: item.unit_id, warehouse_id: row.warehouse_id, created_at: now } });
      await tx.mrp_recommendations.update({ where: { id: row.id }, data: { linked_document_id: order.id } });
      return tx.mrp_recommendations.findUniqueOrThrow({ where: { id: row.id } });
    });
    return recommendationMap(updated);
  }

  export async function acceptProduction(p: { actor: ErpPayload; id: string }): Promise<api.IMrpRecommendation> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Production Manager"], "Only a Production Manager may accept a production recommendation.");
    const row = await recommendation(p.actor, p.id);
    if (row.status !== "open") throw ErrorUtil.conflict("Only an open MRP recommendation can be accepted.");
    if (row.recommendation_type !== "planned_production") throw ErrorUtil.conflict("Only a planned-production recommendation can create a production order.");
    const item = await MyGlobal.prisma.items.findFirst({ where: { id: row.item_id, organization_id: organizationId, active: true, type: { not: "service" } } });
    if (item === null) throw ErrorUtil.notFound("The recommendation item is no longer active.");
    const [bom, routing] = await Promise.all([MyGlobal.prisma.boms.findFirst({ where: { organization_id: organizationId, finished_item_id: item.id, status: "active" }, orderBy: { version: "desc" } }), MyGlobal.prisma.routings.findFirst({ where: { organization_id: organizationId, finished_item_id: item.id, status: "active" }, orderBy: { version: "desc" } })]);
    const now = new Date();
    const updated = await MyGlobal.prisma.$transaction(async (tx) => {
      const claimed = await tx.mrp_recommendations.updateMany({ where: { id: row.id, organization_id: organizationId, status: "open" }, data: { status: "accepted", decision_actor: p.actor.membership_id!, decision_at: now, updated_at: now } });
      if (claimed.count !== 1) throw ErrorUtil.conflict("The recommendation was already decided.");
      const order = await tx.production_orders.create({ data: { id: randomUUID(), organization_id: organizationId, finished_item_id: item.id, equipment_id: null, bom_id: bom?.id ?? null, routing_id: routing?.id ?? null, mrp_recommendation_id: row.id, mrp_run_id: row.run_id, planned_quantity: row.quantity, completed_quantity: 0, scrap_quantity: 0, warehouse_id: row.warehouse_id, location_id: null, started_at: null, closed_at: null, status: "draft", created_at: now, updated_at: now } });
      await tx.mrp_recommendations.update({ where: { id: row.id }, data: { linked_document_id: order.id } });
      return tx.mrp_recommendations.findUniqueOrThrow({ where: { id: row.id } });
    });
    return recommendationMap(updated);
  }

  export async function dismiss(p: { actor: ErpPayload; id: string; reason?: string }): Promise<api.IMrpRecommendation> {
    const organizationId = await AuthProvider.organizationId(p.actor);
    await AuthProvider.requireAnyRole(p.actor, ["Owner", "Production Manager", "Procurement Manager"], "The active roles cannot dismiss an MRP recommendation.");
    const reason = p.reason?.trim() ?? "";
    if (reason.length === 0) throw ErrorUtil.unprocessable("Dismissing an MRP recommendation requires a reason.");
    const updated = await MyGlobal.prisma.mrp_recommendations.updateMany({ where: { id: p.id, organization_id: organizationId, status: "open" }, data: { status: "dismissed", decision_actor: p.actor.membership_id!, decision_reason: reason, decision_at: new Date(), updated_at: new Date() } });
    if (updated.count !== 1) throw ErrorUtil.conflict("Only an open MRP recommendation can be dismissed.");
    return recommendationMap(await MyGlobal.prisma.mrp_recommendations.findUniqueOrThrow({ where: { id: p.id } }));
  }

  async function recommendation(actor: ErpPayload, id: string) {
    const organizationId = await AuthProvider.organizationId(actor);
    const row = await MyGlobal.prisma.mrp_recommendations.findFirst({ where: { id, organization_id: organizationId } });
    if (row === null) throw ErrorUtil.notFound("No MRP recommendation exists in the active organization.");
    return row;
  }

  function sum(values: Map<string, number>): number { return [...values.values()].reduce((total, value) => total + value, 0); }
  function runMap(r: { id: string; horizon_from: Date; horizon_to: Date; trigger_type: string; initiated_by: string; input_snapshot: string; status: string; summary: string }): api.IMrpRun { return { id: r.id, horizonFrom: r.horizon_from.toISOString(), horizonTo: r.horizon_to.toISOString(), triggerType: r.trigger_type as api.IMrpRun["triggerType"], initiatedBy: r.initiated_by, status: r.status as api.IMrpRun["status"], inputSnapshot: JSON.parse(r.input_snapshot) as api.IMrpRun["inputSnapshot"], summary: JSON.parse(r.summary) as api.IMrpRun["summary"] }; }
  function recommendationMap(r: { id: string; run_id: string; recommendation_type: string; item_id: string; warehouse_id: string | null; quantity: number; required_date: Date; status: string; rationale: string; linked_document_id: string | null; decision_reason?: string | null; decision_actor?: string | null; decision_at?: Date | null }): api.IMrpRecommendation { return { id: r.id, runId: r.run_id, recommendationType: r.recommendation_type as api.IMrpRecommendation["recommendationType"], itemId: r.item_id, warehouseId: r.warehouse_id, quantity: r.quantity, requiredDate: r.required_date.toISOString(), status: r.status as api.IMrpRecommendation["status"], rationale: r.rationale, linkedDocumentId: r.linked_document_id, decisionReason: r.decision_reason ?? null, decidedBy: r.decision_actor ?? null, decidedAt: r.decision_at?.toISOString() ?? null }; }
}
