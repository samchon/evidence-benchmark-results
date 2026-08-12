import type { ITodoProfile } from "@benchmark/todo-api";

import { MyGlobal } from "../MyGlobal";
import type { UserPayload } from "../decorators/UserPayload";
import { ErrorUtil } from "../utils/ErrorUtil";

/** Reads and changes the one private profile owned by the current user. */
export namespace ProfileProvider {
  /** Returns the authenticated user's profile and no other account data. */
  export async function at(props: { user: UserPayload }): Promise<ITodoProfile> {
    const row = await MyGlobal.prisma.todo_profiles.findUnique({
      where: { todo_user_id: props.user.id },
      select: { id: true, display_name: true },
    });
    if (row === null) throw ErrorUtil.notFound("The private profile does not exist.");
    return { id: row.id, displayName: row.display_name };
  }

  /** Normalizes and replaces only the current user's display name. */
  export async function update(props: {
    user: UserPayload;
    body: ITodoProfile.IUpdate;
  }): Promise<ITodoProfile> {
    const displayName: string = props.body.displayName.trim();
    if (displayName.length < 1 || displayName.length > 100)
      throw ErrorUtil.unprocessable("Display name must contain 1 through 100 characters.");
    const row = await MyGlobal.prisma.todo_profiles.update({
      where: { todo_user_id: props.user.id },
      data: { display_name: displayName, updated_at: new Date() },
      select: { id: true, display_name: true },
    });
    return { id: row.id, displayName: row.display_name };
  }
}
