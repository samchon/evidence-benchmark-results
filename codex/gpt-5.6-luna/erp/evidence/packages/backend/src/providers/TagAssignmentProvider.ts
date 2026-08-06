import { randomUUID } from "node:crypto";
import type { IAuth, IPage, ITagAssignment } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns tenant-scoped tag assignment and discovery. */
export namespace TagAssignmentProvider {
  export async function create(h: IAuth.IHeaders, input: ITagAssignment.ICreate): Promise<ITagAssignment> {
    const actor = await context(h); const tag = await MyGlobal.prisma.tags.findFirst({ where: { id: input.tagId, organization_id: actor.organizationId } });
    if (tag === null) throw ErrorUtil.notFound("No tag has this identifier."); if (!tag.active) throw ErrorUtil.conflict("Inactive tags cannot be assigned.");
    const existing = await MyGlobal.prisma.tag_assignments.findFirst({ where: { tag_id: input.tagId, target_type: input.targetType, target_id: input.targetId } });
    if (existing !== null) return map(existing);
    return map(await MyGlobal.prisma.tag_assignments.create({ data: { id: randomUUID(), tag_id: input.tagId, target_type: input.targetType, target_id: input.targetId, created_at: new Date() } }));
  }
  export async function index(h: IAuth.IHeaders, input: ITagAssignment.IRequest): Promise<IPage<ITagAssignment>> { const actor = await context(h); const rows = await MyGlobal.prisma.tag_assignments.findMany({ where: { tag: { organization_id: actor.organizationId }, ...(input.tagId ? { tag_id: input.tagId } : {}), ...(input.targetType ? { target_type: input.targetType } : {}), ...(input.targetId ? { target_id: input.targetId } : {}) }, orderBy: { created_at: "desc" } }); return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(map) }; }
  export async function remove(h: IAuth.IHeaders, id: string): Promise<{ success: true }> { const actor = await context(h); const row = await MyGlobal.prisma.tag_assignments.findFirst({ where: { id, tag: { organization_id: actor.organizationId } } }); if (row === null) throw ErrorUtil.notFound("No tag assignment has this identifier."); await MyGlobal.prisma.tag_assignments.delete({ where: { id } }); return { success: true }; }
  function map(r: Prisma.tag_assignmentsGetPayload<{}>): ITagAssignment { return { id: r.id as ITagAssignment["id"], tagId: r.tag_id as ITagAssignment["tagId"], targetType: r.target_type, targetId: r.target_id, createdAt: r.created_at.toISOString() }; }
  async function context(h: IAuth.IHeaders) { const actor = await AuthProvider.authorize(h); const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } }); if (!session?.selected_organization_id) throw ErrorUtil.forbidden("Select an active organization before tag assignment work."); return { organizationId: session.selected_organization_id }; }
}
