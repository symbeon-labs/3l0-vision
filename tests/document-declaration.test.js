import test from "node:test";
import assert from "node:assert/strict";
import { createDocumentItemObservation } from "../core/receiving/document-declaration.js";

test("creates a source-preserving NF-e item observation without claiming physical truth", () => {
  const observation = createDocumentItemObservation({
    observationId: "obs-nfe-001",
    observedAt: "2026-10-21T12:00:00.000Z",
    sourceRef: "nfe://authorized-source/doc-1/item-1",
    documentNumber: "doc-1",
    issuerId: "issuer-1",
    item: {
      code: "A-001",
      gtin: "7891234567890",
      description: "Bebida 350 ml",
      commercialUnit: "UN",
      quantity: "12.0000",
      unitPrice: "4.50",
      totalValue: "54.00",
      ncm: "00000000"
    }
  });

  assert.equal(observation.source, "fiscal-document");
  assert.equal(observation.modality, "structured-document");
  assert.deepEqual(observation.identifiers.map((entry) => entry.scheme), ["document-item-code", "gtin"]);
  assert.equal(observation.attributes.quantity, "12.0000");
  assert.equal(observation.metadata.declared_values_only, true);
  assert.equal(observation.context.claim_scope, "document-declaration");
  assert.equal(observation.entity_id, undefined);
});

test("rejects a document item without identifying declaration", () => {
  assert.throws(() => createDocumentItemObservation({
    observationId: "obs-1",
    observedAt: "2026-10-21T12:00:00.000Z",
    sourceRef: "source-1",
    item: {}
  }), /requires a declared code or description/);
});
