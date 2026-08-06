import { randomUUID } from "node:crypto";

import type { IAuth, IContact, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns organization-scoped contact CRUD and retirement. */
export namespace ContactProvider {
  /** Create a contact in the selected organization. */
  export async function create(props: { headers: IAuth.IHeaders; input: IContact.ICreate }): Promise<IContact> {
    const organizationId = await organization(props.headers);
    const now = new Date();
    return transform(await MyGlobal.prisma.contacts.create({ data: { id: randomUUID(), organization_id: organizationId, name: props.input.name, email: props.input.email ?? null, phone: props.input.phone ?? null, active: true, created_at: now, updated_at: now } }));
  }

  /** Search contacts in the selected organization. */
  export async function index(props: { headers: IAuth.IHeaders; input: IContact.IRequest }): Promise<IPage<IContact>> {
    const organizationId = await organization(props.headers);
    const where: Prisma.contactsWhereInput = { organization_id: organizationId, ...(props.input.includeInactive ? {} : { active: true }), ...(props.input.search ? { name: { contains: props.input.search } } : {}), ...(props.input.email ? { email: { contains: props.input.email } } : {}) };
    const rows = await MyGlobal.prisma.contacts.findMany({ where, orderBy: { created_at: "desc" } });
    return { pagination: { current: 1, limit: 0, records: rows.length, pages: 1 }, data: rows.map(transform) };
  }

  /** Update communication details while retaining contact identity. */
  export async function update(props: { headers: IAuth.IHeaders; id: string; input: IContact.IUpdate }): Promise<IContact> {
    const organizationId = await organization(props.headers);
    await ensure(props.id, organizationId);
    return transform(await MyGlobal.prisma.contacts.update({ where: { id: props.id }, data: { ...(props.input.name !== undefined && props.input.name !== null ? { name: props.input.name } : {}), ...(props.input.email !== undefined ? { email: props.input.email } : {}), ...(props.input.phone !== undefined ? { phone: props.input.phone } : {}), updated_at: new Date() } }));
  }

  /** Activate or retire a contact for new party relationships. */
  export async function status(props: { headers: IAuth.IHeaders; id: string; active: boolean }): Promise<IContact> {
    const organizationId = await organization(props.headers);
    await ensure(props.id, organizationId);
    return transform(await MyGlobal.prisma.contacts.update({ where: { id: props.id }, data: { active: props.active, updated_at: new Date() } }));
  }

  /** Assign a contact to a vendor or customer, preserving one primary contact per party. */
  export async function assign(props: { headers: IAuth.IHeaders; id: string; input: IContact.IAssign }): Promise<IContact.IAssignment> {
    const organizationId = await organization(props.headers);
    await ensure(props.id, organizationId);
    const party = props.input.partyType === "vendor"
      ? await MyGlobal.prisma.vendors.findFirst({ where: { id: props.input.partyId, organization_id: organizationId } })
      : await MyGlobal.prisma.customers.findFirst({ where: { id: props.input.partyId, organization_id: organizationId } });
    if (party === null) throw ErrorUtil.notFound("No party has this identifier.");
    const primary = props.input.primary ?? false;
    const row = await MyGlobal.prisma.$transaction(async (tx) => {
      if (primary) await tx.contact_assignments.updateMany({ where: { party_type: props.input.partyType, party_id: props.input.partyId, primary: true }, data: { primary: false } });
      return tx.contact_assignments.upsert({ where: { party_type_party_id_contact_id: { party_type: props.input.partyType, party_id: props.input.partyId, contact_id: props.id } }, create: { id: randomUUID(), contact_id: props.id, party_type: props.input.partyType, party_id: props.input.partyId, primary, created_at: new Date() }, update: { primary } });
    });
    return { id: row.id as IContact.IAssignment["id"], contactId: row.contact_id as IContact.IAssignment["contactId"], partyType: row.party_type as IContact.IAssignment["partyType"], partyId: row.party_id as IContact.IAssignment["partyId"], primary: row.primary, createdAt: row.created_at.toISOString() };
  }

  /** Map a persisted contact to the public DTO. */
  export function transform(row: Prisma.contactsGetPayload<{}>): IContact {
    return { id: row.id as IContact["id"], name: row.name, email: row.email, phone: row.phone, active: row.active, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() };
  }

  async function organization(headers: IAuth.IHeaders): Promise<string> {
    const actor = await AuthProvider.authorize(headers);
    const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } });
    if (session?.selected_organization_id === null || session === null) throw ErrorUtil.forbidden("Select an active organization before contact work.");
    return session.selected_organization_id;
  }
  async function ensure(id: string, organizationId: string): Promise<void> {
    if (await MyGlobal.prisma.contacts.findFirst({ where: { id, organization_id: organizationId } }) === null) throw ErrorUtil.notFound("No contact has this identifier.");
  }
}
