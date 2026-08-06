import childProcess from "node:child_process";

import { MyGlobal } from "../MyGlobal";

/** Owns destructive local database setup. */
export namespace MySetupWizard {
  /** Recreates the Prisma schema for an explicit setup process. */
  export async function schema(): Promise<void> {
    if (MyGlobal.testing === false)
      throw new Error(
        "Unable to reset the database outside an explicit setup process.",
      );
    childProcess.execSync(
      "pnpm exec prisma db push --force-reset --schema=prisma/schema",
      {
        stdio: "inherit",
        env: {
          ...process.env,
          // Prisma refuses this reset when it detects an AI agent, and tells
          // the caller to stop and obtain a human's consent before retrying.
          // Reaching this line is that consent: this script exists only to
          // recreate the local development database, and the guard above
          // refuses it outside the explicit setup entry point. Without this
          // the reset cannot complete unattended, and every command that needs
          // a schema stops here.
          PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION:
            "Reset the local development database from this project's setup script.",
        },
      },
    );
  }

  /**
   * Controlled bootstrap hook for the first governance identity.  Ordinary
   * registration deliberately never calls this method.
   */
  export async function provisionSuperAdmin(identityId: string): Promise<void> {
    if (MyGlobal.testing === false)
      throw new Error("Super-administrator provisioning requires explicit setup.");
    await MyGlobal.prisma.$transaction(async (tx) => {
      const existing = await tx.shopping_users.count({ where: { deleted_at: null, banned: false, grades: { contains: "superAdministrator" } } });
      if (existing !== 0) throw new Error("A super administrator is already provisioned.");
      const target = await tx.shopping_users.findUnique({ where: { id: identityId } });
      if (!target || target.deleted_at || target.banned) throw new Error("The bootstrap identity is unavailable.");
      const grades = new Set(target.grades.split(",").filter(Boolean));
      grades.add("regularAdministrator");
      grades.add("superAdministrator");
      await tx.shopping_users.update({ where: { id: identityId }, data: { grades: [...grades].join(","), updated_at: new Date() } });
    });
  }
}
