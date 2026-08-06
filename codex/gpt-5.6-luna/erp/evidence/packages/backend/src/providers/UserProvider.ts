import type { IAuth } from "@benchmark/erp-api";
import { MyGlobal } from "../MyGlobal";
import { ErrorUtil } from "../utils/ErrorUtil";
import { AuthProvider } from "./AuthProvider";

/** Owns self-service global profile and credential lifecycle. */
export namespace UserProvider {
  export async function profile(headers: IAuth.IHeaders): Promise<IAuth.IUser> {
    const actor = await AuthProvider.authorize(headers);
    const user = await MyGlobal.prisma.users.findUnique({ where: { id: actor.id } });
    if (user === null) throw ErrorUtil.unauthorized("The authenticated user no longer exists.");
    return AuthProvider.transform(user);
  }

  export async function updateProfile(headers: IAuth.IHeaders, input: IAuth.IProfileUpdate): Promise<IAuth.IUser> {
    const actor = await AuthProvider.authorize(headers);
    const user = await MyGlobal.prisma.users.update({ where: { id: actor.id }, data: { ...(input.displayName !== undefined && input.displayName !== null ? { display_name: input.displayName } : {}), ...(input.avatar !== undefined ? { avatar: input.avatar } : {}), ...(input.phone !== undefined ? { phone: input.phone } : {}), ...(input.locale !== undefined && input.locale !== null ? { locale: input.locale } : {}), ...(input.timezone !== undefined && input.timezone !== null ? { timezone: input.timezone } : {}), updated_at: new Date() } });
    return AuthProvider.transform(user);
  }

  export async function changePassword(headers: IAuth.IHeaders, input: IAuth.IPasswordChange): Promise<{ success: true }> {
    const actor = await AuthProvider.authorize(headers);
    const user = await MyGlobal.prisma.users.findUnique({ where: { id: actor.id } });
    if (user === null || AuthProvider.verifyCredential(input.currentPassword, user.password_hash) === false) throw ErrorUtil.unauthorized("The current password is incorrect.");
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.users.update({ where: { id: actor.id }, data: { password_hash: AuthProvider.hashCredential(input.newPassword), updated_at: new Date() } }),
      MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, id: { not: actor.sessionId }, revoked_at: null }, data: { revoked_at: new Date() } }),
    ]);
    return { success: true };
  }

  export async function deactivate(headers: IAuth.IHeaders): Promise<{ success: true }> {
    const actor = await AuthProvider.authorize(headers);
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.users.update({ where: { id: actor.id }, data: { active: false, updated_at: new Date() } }),
      MyGlobal.prisma.sessions.updateMany({ where: { user_id: actor.id, revoked_at: null }, data: { revoked_at: new Date() } }),
    ]);
    return { success: true };
  }
}
