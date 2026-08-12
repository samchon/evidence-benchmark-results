import crypto from "node:crypto";

import { MyGlobal } from "../MyGlobal";

/**
 * Provisions the first super administrator through an explicit operator action.
 * The command never runs as part of registration or normal application startup.
 * Invoke it with BOOTSTRAP_ADMIN_EMAIL set to an existing active identity.
 */
async function main(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  if (email === undefined || email.length === 0) throw new Error("BOOTSTRAP_ADMIN_EMAIL is required.");
  const prisma = MyGlobal.prisma;
  try {
    if (await prisma.shopping_administrator_grades.count({ where: { grade: "superAdministrator" } }) > 0)
      throw new Error("A super administrator is already provisioned.");
    const customer = await prisma.shopping_customers.findFirst({ where: { email, deleted_at: null, login_status: "active" } });
    const seller = await prisma.shopping_sellers.findFirst({ where: { email, deleted_at: null, login_status: "active" } });
    if ((customer === null) === (seller === null)) throw new Error("The email must identify exactly one active customer or seller.");
    const actorType = customer === null ? "seller" : "customer";
    const actorId = customer?.id ?? seller!.id;
    await prisma.shopping_administrator_grades.create({ data: { id: crypto.randomUUID(), actor_type: actorType, actor_id: actorId, grade: "superAdministrator", created_at: new Date() } });
    console.log(`Provisioned the initial super administrator for ${email}.`);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
