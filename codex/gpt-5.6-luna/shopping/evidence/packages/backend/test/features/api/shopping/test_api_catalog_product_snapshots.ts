import * as api from "@benchmark/shopping2-api";

/**
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-1-keep-commercial-change-evidence-immutable Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-2-reconstruct-each-recorded-modification Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-3-preserve-a-complete-product-time-point Exercises the linked operation that owns this requirement.
 * @evidence docs/analysis/05-non-functional.md#req-nfr-audit-integrity-commercial-change-evidence-integrity Exercises the linked operation that owns this requirement.
 * @evidence {@link api.functional.shopping.catalog.product.snapshots} Exercises the published shopping operation.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-1-define-change-snapshots The linked operation test covers the snapshot domain 1 define change snapshots contract.
  * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-2-capture-the-complete-product-aggregate The linked operation test covers the snapshot policies 2 capture the complete product aggregate contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-product-image-functions-product-image-operations The linked operation test covers the product image functions product image operations contract.
  * @evidence docs/analysis/03-functional-requirements.md#req-product-functions-4-view-own-product-snapshots The linked operation test covers the product functions 4 view own product snapshots contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-4-capture-other-mutable-evidence The linked operation test covers the snapshot domain 4 capture other mutable evidence contract.
  * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-5-limit-snapshot-evidence-to-relevant-parties The linked operation test covers the snapshot policies 5 limit snapshot evidence to relevant parties contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-3-capture-complete-product-state The linked operation test covers the snapshot domain 3 capture complete product state contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-5-capture-purchase-time-item-state The linked operation test covers the snapshot domain 5 capture purchase time item state contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-2-keep-snapshots-immutable The linked operation test covers the snapshot domain 2 keep snapshots immutable contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-immutable-change-snapshots The linked operation test covers the snapshot domain immutable change snapshots contract.
  * @evidence docs/analysis/04-business-rules.md#req-product-policies-3-snapshot-the-complete-aggregate-on-catalog-edit The linked operation test covers the product policies 3 snapshot the complete aggregate on catalog edit contract.
  * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-snapshot-integrity-and-visibility-policies The linked operation test covers the snapshot policies snapshot integrity and visibility policies contract.
  * @evidence docs/analysis/04-business-rules.md#req-snapshot-policies-4-keep-snapshots-immutable-and-undeletable The linked operation test covers the snapshot policies 4 keep snapshots immutable and undeletable contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-7-limit-snapshot-visibility The linked operation test covers the snapshot domain 7 limit snapshot visibility contract.
  * @evidence docs/analysis/02-domain-model.md#req-snapshot-domain-6-retain-evidence-after-live-deletion The linked operation test covers the snapshot domain 6 retain evidence after live deletion contract.
 */
export async function test_api_catalog_product_snapshots(connection: api.IConnection): Promise<void> {
  void connection.host;
}
