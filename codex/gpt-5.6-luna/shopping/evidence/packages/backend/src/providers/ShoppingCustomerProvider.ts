import type { IShoppingCustomer } from "@benchmark/shopping-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Owns customer profile reads and edits within the authenticated identity. */
export namespace ShoppingCustomerProvider {
  /** Reads the current customer profile. */
  export async function at(id: string): Promise<IShoppingCustomer> {
    const row = await MyGlobal.prisma.shopping_customers.findFirst({ where: { id, deleted_at: null } });
    if (row === null) throw ErrorUtil.notFound("The customer account does not exist.");
    return { id: row.id, email: row.email, loginStatus: row.login_status, displayName: row.display_name, phoneNumber: row.phone_number, createdAt: row.created_at.toISOString(), grades: await grades(id) };
  }

  /** Replaces the editable customer profile. */
  export async function update(id: string, input: IShoppingCustomer.IProfileUpdate): Promise<IShoppingCustomer> {
    await MyGlobal.prisma.shopping_customers.update({ where: { id }, data: { display_name: input.displayName, phone_number: input.phoneNumber, updated_at: new Date(), profile: { update: { display_name: input.displayName, phone_number: input.phoneNumber, updated_at: new Date() } } } });
    return at(id);
  }

  async function grades(id: string): Promise<string[]> {
    const rows = await MyGlobal.prisma.shopping_administrator_grades.findMany({ where: { actor_id: id } });
    return rows.map((row) => row.grade);
  }
}
