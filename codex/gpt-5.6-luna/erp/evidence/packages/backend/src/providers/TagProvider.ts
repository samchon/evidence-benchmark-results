import { randomUUID } from "node:crypto";
import type { IAuth, IPage, ITag } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns organization-scoped tag definitions and assignments. */
export namespace TagProvider {
  export async function create(props: { headers: IAuth.IHeaders; input: ITag.ICreate }): Promise<ITag> {
    const organizationId = await organization(props.headers);
    const now = new Date();
    return transform(await MyGlobal.prisma.tags.create({ data: { id: randomUUID(), organization_id: organizationId, label: props.input.label.trim(), description: props.input.description ?? null, active: true, created_at: now, updated_at: now } }));
  }
  export async function index(props: { headers: IAuth.IHeaders; input: ITag.IRequest }): Promise<IPage<ITag>> {
    const organizationId = await organization(props.headers);
    const where: Prisma.tagsWhereInput = { organization_id: organizationId, ...(props.input.includeInactive ? {} : { active: true }), ...(props.input.search ? { label: { contains: props.input.search.trim() } } : {}) };
    const rows = await MyGlobal.prisma.tags.findMany({ where, orderBy: { label: "asc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(transform) };
  }
  export async function update(props: { headers: IAuth.IHeaders; id: string; input: ITag.IUpdate }): Promise<ITag> {
    const organizationId = await organization(props.headers);
    await ensure(props.id, organizationId);
    return transform(await MyGlobal.prisma.tags.update({ where: { id: props.id }, data: { ...(props.input.label !== undefined && props.input.label !== null ? { label: props.input.label.trim() } : {}), ...(props.input.description !== undefined ? { description: props.input.description } : {}), updated_at: new Date() } }));
  }
  export async function status(props: { headers: IAuth.IHeaders; id: string; active: boolean }): Promise<ITag> {
    const organizationId = await organization(props.headers);
    await ensure(props.id, organizationId);
    return transform(await MyGlobal.prisma.tags.update({ where: { id: props.id }, data: { active: props.active, updated_at: new Date() } }));
  }
  export function transform(row: Prisma.tagsGetPayload<{}>): ITag { return { id: row.id as ITag["id"], label: row.label, description: row.description, active: row.active, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() }; }
  async function organization(headers: IAuth.IHeaders): Promise<string> {
    const actor = await AuthProvider.authorize(headers);
    const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } });
    if (session?.selected_organization_id === null || session === null) throw ErrorUtil.forbidden("Select an active organization before tag work.");
    return session.selected_organization_id;
  }
  async function ensure(id: string, organizationId: string): Promise<void> { if (await MyGlobal.prisma.tags.findFirst({ where: { id, organization_id: organizationId } }) === null) throw ErrorUtil.notFound("No tag has this identifier."); }
}
