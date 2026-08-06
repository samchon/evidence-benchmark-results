import { randomUUID } from "node:crypto";

import type { IAddress, IAuth, IPage } from "@benchmark/erp-api";
import { Prisma } from "@prisma/sdk";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns organization-scoped address CRUD and retirement. */
export namespace AddressProvider {
  /** Create an address inside the selected organization. */
  export async function create(props: { headers: IAuth.IHeaders; input: IAddress.ICreate }): Promise<IAddress> {
    const organizationId = await organization(props.headers);
    const now = new Date();
    const row = await MyGlobal.prisma.addresses.create({
      data: {
        id: randomUUID(),
        organization_id: organizationId,
        label: props.input.label,
        line1: props.input.line1,
        line2: props.input.line2 ?? null,
        city: props.input.city,
        region: props.input.region ?? null,
        postal_code: props.input.postalCode ?? null,
        country_code: props.input.countryCode.toUpperCase(),
        active: true,
        created_at: now,
        updated_at: now,
      },
    });
    return transform(row);
  }

  /** Search reusable addresses in the selected organization. */
  export async function index(props: { headers: IAuth.IHeaders; input: IAddress.IRequest }): Promise<IPage<IAddress>> {
    const organizationId = await organization(props.headers);
    const includeInactive = props.input.includeInactive ?? false;
    const where: Prisma.addressesWhereInput = {
      organization_id: organizationId,
      ...(includeInactive ? {} : { active: true }),
      ...(props.input.search !== undefined && props.input.search !== null
        ? { OR: [{ label: { contains: props.input.search } }, { city: { contains: props.input.search } }] }
        : {}),
    };
    const rows = await MyGlobal.prisma.addresses.findMany({ where, orderBy: { created_at: "desc" } });
    return {
      pagination: { current: 1, limit: 0, records: rows.length, pages: 1 },
      data: rows.map(transform),
    };
  }

  /** Update reusable address details without changing historical usages. */
  export async function update(props: { headers: IAuth.IHeaders; id: string; input: IAddress.IUpdate }): Promise<IAddress> {
    const organizationId = await organization(props.headers);
    const current = await MyGlobal.prisma.addresses.findFirst({ where: { id: props.id, organization_id: organizationId } });
    if (current === null) throw ErrorUtil.notFound("No address has this identifier.");
    const row = await MyGlobal.prisma.addresses.update({
      where: { id: current.id },
      data: {
        ...(props.input.label !== undefined && props.input.label !== null ? { label: props.input.label } : {}),
        ...(props.input.line1 !== undefined && props.input.line1 !== null ? { line1: props.input.line1 } : {}),
        ...(props.input.line2 !== undefined ? { line2: props.input.line2 } : {}),
        ...(props.input.city !== undefined && props.input.city !== null ? { city: props.input.city } : {}),
        ...(props.input.region !== undefined ? { region: props.input.region } : {}),
        ...(props.input.postalCode !== undefined ? { postal_code: props.input.postalCode } : {}),
        ...(props.input.countryCode !== undefined && props.input.countryCode !== null ? { country_code: props.input.countryCode.toUpperCase() } : {}),
        updated_at: new Date(),
      },
    });
    return transform(row);
  }

  /** Activate or retire an address for future relationship selection. */
  export async function status(props: { headers: IAuth.IHeaders; id: string; input: IAddress.IStatus }): Promise<IAddress> {
    const organizationId = await organization(props.headers);
    const current = await MyGlobal.prisma.addresses.findFirst({ where: { id: props.id, organization_id: organizationId } });
    if (current === null) throw ErrorUtil.notFound("No address has this identifier.");
    const row = await MyGlobal.prisma.addresses.update({ where: { id: current.id }, data: { active: props.input.active, updated_at: new Date() } });
    return transform(row);
  }

  /** Map a persisted address to the public DTO. */
  export function transform(row: Prisma.addressesGetPayload<{}>): IAddress {
    return {
      id: row.id as IAddress["id"],
      label: row.label,
      line1: row.line1,
      line2: row.line2,
      city: row.city,
      region: row.region,
      postalCode: row.postal_code,
      countryCode: row.country_code,
      active: row.active,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }

  async function organization(headers: IAuth.IHeaders): Promise<string> {
    const actor = await AuthProvider.authorize(headers);
    const session = await MyGlobal.prisma.sessions.findUnique({ where: { id: actor.sessionId }, select: { selected_organization_id: true } });
    if (session?.selected_organization_id === null || session === null)
      throw ErrorUtil.forbidden("Select an active organization before address work.");
    return session.selected_organization_id;
  }
}
