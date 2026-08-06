import type { IProfile } from "@benchmark/todo-api";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import type { UserPayload } from "../auth/AuthProvider";

/** Private profile reads and writes. */
export namespace ProfileProvider {
  export async function at(actor: UserPayload): Promise<IProfile> {
    const row = await MyGlobal.prisma.user_profiles.findUnique({ where: { user_account_id: actor.id } });
    if (row === null) throw ErrorUtil.notFound("Profile not found.");
    return { displayName: row.display_name };
  }
  export async function update(actor: UserPayload, input: IProfile.IUpdate): Promise<IProfile> {
    const displayName = input.displayName.trim();
    if (displayName.length < 1 || displayName.length > 100) throw ErrorUtil.unprocessable("Display name must contain 1 through 100 characters.");
    const row = await MyGlobal.prisma.user_profiles.update({ where: { user_account_id: actor.id }, data: { display_name: displayName } });
    return { displayName: row.display_name };
  }
}
