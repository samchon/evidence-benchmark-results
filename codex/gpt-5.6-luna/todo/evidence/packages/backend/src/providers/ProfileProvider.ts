import type { IProfile, IProfileUpdate } from "@benchmark/todo-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { AuthProvider } from "./AuthProvider";

/** Owns the authenticated account's private profile operations. */
export namespace ProfileProvider {
  /** Reads the one profile owned by the actor. */
  export async function at(actor: AuthProvider.Payload): Promise<IProfile> {
    const row = await MyGlobal.prisma.todo_profiles.findUnique({ where: { todo_account_id: actor.id } });
    if (row === null) throw ErrorUtil.notFound("No profile is available.");
    return transform(row);
  }

  /** Replaces only the actor's display name. */
  export async function update(actor: AuthProvider.Payload, body: IProfileUpdate): Promise<IProfile> {
    const displayName = body.displayName.trim();
    if (displayName.length === 0 || displayName.length > 100) throw ErrorUtil.unprocessable("Display name must contain 1 to 100 characters.");
    const row = await MyGlobal.prisma.todo_profiles.update({ where: { todo_account_id: actor.id }, data: { display_name: displayName, updated_at: new Date() } });
    return transform(row);
  }

  function transform(row: { id: string; display_name: string; created_at: Date; updated_at: Date }): IProfile {
    return { id: row.id, displayName: row.display_name, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString() };
  }
}
