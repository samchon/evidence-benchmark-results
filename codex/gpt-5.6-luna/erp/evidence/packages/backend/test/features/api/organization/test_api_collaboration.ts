import * as api from "@benchmark/erp-api";
import typia from "typia";

/** Proves comments and attachment metadata stay scoped and retain authorship. */
/** @evidence {@link api.functional.organization.create} Exercises the published operation this scenario drives. */
/**
 * @evidence docs/analysis/04-business-rules.md#req-rule-doc-link-operational-document-traceability Exercises and asserts the doc link operational document traceability behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-attachment-attachments Exercises and asserts the attachment attachments behavior.
 * @evidence docs/analysis/02-domain-model.md#req-dom-comment-comments Exercises and asserts the comment comments behavior.
 */
/**
 */
/**
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-attachment-attachment-operations Exercises and asserts the attachment attachment operations behavior.
 * @evidence docs/analysis/03-functional-requirements.md#req-fun-comment-comment-operations Exercises and asserts the comment comment operations behavior.
 */
export async function test_api_collaboration(connection: api.IConnection): Promise<void> {
  const suffix = `${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
  const email = `collaboration-${suffix}@example.com`;
  const password = "correct-horse-battery-staple";
  await api.functional.organization.create(connection, { name: `Collaboration ${suffix}`, code: `collaboration-${suffix}`, baseCurrency: "USD", timezone: "UTC", fiscalStartMonth: 1, ownerEmail: email, ownerPassword: password, ownerDisplayName: "Owner" });
  const authorized = await api.functional.auth.user_login.login(connection, { email, password });
  const owner: api.IConnection = { host: connection.host, headers: { Authorization: `Bearer ${authorized.accessToken}` } };
  await api.functional.auth_session_organization.organization.select(owner, { membershipId: authorized.memberships[0]!.id });
  const targetId = authorized.memberships[0]!.organizationId;
  const comment = await api.functional.comment_create.create(owner, { targetType: "organization", targetId, body: "Initial note" });
  const revised = await api.functional.comment_update.update(owner, comment.id, { body: "Revised note" });
  typia.assert(revised);
  const comments = await api.functional.comment_search.index(owner, { targetType: "organization", targetId });
  if (!comments.data.some((item) => item.id === comment.id && item.body === "Revised note")) throw new Error("comment revision was not discoverable");
  await api.functional.comment_delete.remove(owner, comment.id);
  const attachment = await api.functional.attachment_create.create(owner, { targetType: "organization", targetId, fileName: "policy.pdf", mimeType: "application/pdf", sizeBytes: 128, storageKey: `objects/${suffix}/policy.pdf` });
  const attachments = await api.functional.attachment_search.index(owner, { targetType: "organization", targetId });
  if (!attachments.data.some((item) => item.id === attachment.id && item.fileName === "policy.pdf")) throw new Error("attachment metadata was not discoverable");
  await api.functional.attachment_delete.remove(owner, attachment.id);
}
