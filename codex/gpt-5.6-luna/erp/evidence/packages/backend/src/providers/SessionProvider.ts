import type { IAuth, IMembership } from "@benchmark/erp-api";

import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";
import { MembershipProvider } from "./MembershipProvider";

/** Owns explicit organization selection and session termination. */
export namespace SessionProvider {
  /** Select one active membership as the current operating organization. */
  export async function select(props: {
    headers: IAuth.IHeaders;
    input: IMembership.ISelect;
  }): Promise<IMembership> {
    const actor = await AuthProvider.authorize(props.headers);
    const membership = await MyGlobal.prisma.memberships.findFirst({
      where: { id: props.input.membershipId, user_id: actor.id, status: "active", organization: { active: true } },
      include: { organization: true, roles: { include: { role: true } } },
    });
    if (membership === null) throw ErrorUtil.forbidden("Only an active membership may be selected.");
    await MyGlobal.prisma.sessions.update({
      where: { id: actor.sessionId },
      data: { selected_organization_id: membership.organization_id },
    });
    return MembershipProvider.transform(membership);
  }

  /** Revoke only the current session. */
  export async function logout(props: { headers: IAuth.IHeaders }): Promise<void> {
    const actor = await AuthProvider.authorize(props.headers);
    await MyGlobal.prisma.sessions.update({ where: { id: actor.sessionId }, data: { revoked_at: new Date() } });
  }

  /** Revoke every active session for the global user. */
  export async function logoutAll(props: { headers: IAuth.IHeaders }): Promise<void> {
    const actor = await AuthProvider.authorize(props.headers);
    await MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } });
  }
}
