import { randomUUID } from "node:crypto";
import { MyGlobal } from "../MyGlobal";

/** Issues an organization/type-scoped number using an atomic sequence. */
export namespace DocumentNumberService {
  export async function next(organizationId: string, documentType: string): Promise<string> {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await MyGlobal.prisma.$transaction(async (tx) => {
          const now = new Date();
          await tx.document_number_sequences.upsert({
            where: { organization_id_document_type: { organization_id: organizationId, document_type: documentType } },
            create: { id: randomUUID(), organization_id: organizationId, document_type: documentType, prefix: `${documentType.toUpperCase()}-`, padding: 6, next_value: 1, active: true, created_at: now, updated_at: now },
            update: {},
          });
          const row = await tx.document_number_sequences.update({ where: { organization_id_document_type: { organization_id: organizationId, document_type: documentType } }, data: { next_value: { increment: 1 }, updated_at: now } });
          if (!row.active) throw new Error("Document numbering is inactive for this document type.");
          return `${row.prefix}${String(row.next_value - 1).padStart(row.padding, "0")}`;
        });
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    throw new Error("Unable to issue a document number.");
  }
}
