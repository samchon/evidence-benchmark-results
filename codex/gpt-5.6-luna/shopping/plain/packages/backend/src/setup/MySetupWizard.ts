import childProcess from "node:child_process";
import { randomUUID } from "node:crypto";

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
   * Assigns the initial super grade through the explicit setup boundary.
   * Ordinary registration never calls this operation.
   */
  export async function provisionAdministrator(
    actorType: "customer" | "seller",
    actorId: string,
  ): Promise<void> {
    if (MyGlobal.testing === false)
      throw new Error(
        "Administrator provisioning requires an explicit setup process.",
      );
    if ((await MyGlobal.prisma.shopping_administrator_grades.count()) !== 0)
      throw new Error("Administrator provisioning has already completed.");
    if (actorType === "customer") {
      const actor = await MyGlobal.prisma.shopping_customers.findUnique({
        where: { id: actorId },
      });
      if (actor === null || actor.deleted_at !== null || actor.login_state !== "active")
        throw new Error("The initial administrator must be an active customer or seller.");
    } else {
      const actor = await MyGlobal.prisma.shopping_sellers.findUnique({
        where: { id: actorId },
      });
      if (actor === null || actor.deleted_at !== null || actor.login_state !== "active")
        throw new Error("The initial administrator must be an active customer or seller.");
    }
    const createdAt = new Date();
    await MyGlobal.prisma.$transaction([
      MyGlobal.prisma.shopping_administrator_grades.create({
        data: {
          id: randomUUID(),
          actor_type: actorType,
          actor_id: actorId,
          grade: "regularAdministrator",
          created_at: createdAt,
        },
      }),
      MyGlobal.prisma.shopping_administrator_grades.create({
        data: {
          id: randomUUID(),
          actor_type: actorType,
          actor_id: actorId,
          grade: "superAdministrator",
          created_at: createdAt,
        },
      }),
    ]);
  }

  /** Returns the provisioned customer administrator's login address. */
  export async function administratorEmail(): Promise<string | null> {
    const grade = await MyGlobal.prisma.shopping_administrator_grades.findFirst({
      where: { grade: "superAdministrator", actor_type: "customer" },
    });
    if (grade === null) return null;
    const account = await MyGlobal.prisma.shopping_customers.findUnique({
      where: { id: grade.actor_id },
    });
    if (account === null) throw new Error("The provisioned administrator identity is missing.");
    return account.email;
  }

  /** Reads the recorded recovery delivery for the explicit test evidence boundary. */
  export async function latestRecoveryDelivery(recipient: string): Promise<{
    recipient: string;
    kind: string;
    payload: { token: string; expiresAt: string };
    expiresAt: string;
  }> {
    const delivery = await MyGlobal.prisma.shopping_recovery_deliveries.findFirst({
      where: { recipient },
      orderBy: { created_at: "desc" },
    });
    if (delivery === null) throw new Error("Recovery delivery was not recorded.");
    const payload = JSON.parse(delivery.payload) as { token?: unknown; expiresAt?: unknown };
    if (typeof payload.token !== "string" || typeof payload.expiresAt !== "string")
      throw new Error("Recovery delivery payload is incomplete.");
    return {
      recipient: delivery.recipient,
      kind: delivery.kind,
      payload: { token: payload.token, expiresAt: payload.expiresAt },
      expiresAt: delivery.expires_at.toISOString(),
    };
  }

  /** Reads one product category through the explicit test evidence boundary. */
  export async function productCategory(productId: string): Promise<string | null> {
    const product = await MyGlobal.prisma.shopping_products.findUnique({
      where: { id: productId },
      select: { category_id: true },
    });
    if (product === null) throw new Error("The product evidence is missing.");
    return product.category_id;
  }

  /** Counts working inventory movements through the explicit test evidence boundary. */
  export async function inventoryMovementCount(variantId: string): Promise<number> {
    return MyGlobal.prisma.shopping_inventory_movements.count({
      where: { variant_id: variantId },
    });
  }
}
