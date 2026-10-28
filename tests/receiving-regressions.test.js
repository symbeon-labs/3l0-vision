import test from "node:test";
import assert from "node:assert/strict";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";

function resolveReceiving({ id, documentLine, physical, candidates = [] }) {
  const entities = candidates.map((candidate) => ({
    entity_id: candidate.record_id,
    identifiers: candidate.gtin ? [{ scheme: "gtin", value: candidate.gtin }] : [],
    attributes: { name: candidate.description, unit: candidate.unit, pack_size: candidate.pack_size }
  }));
  const observation = {
    observation_id: `obs-${id}`,
    identifiers: physical.barcode ? [{ scheme: "gtin", value: physical.barcode }] : [],
    attributes: {},
    evidence: []
  };
  return deterministicResolver({
    resolution_id: id,
    question: { type: "receiving_reconciliation" },
    entities,
    observations: [observation],
    context: {
      receiving: {
        document_line: documentLine,
        physical_observation: physical,
        catalog_candidates: candidates
      }
    }
  });
}

test("SYN-003 blocks resolution when document GTIN conflicts with physical barcode", () => {
  const result = resolveReceiving({
    id: "SYN-003",
    documentLine: { gtin: "TEST-GTIN-003", description: "Café torrado 500g", unit: "UN", quantity: 10 },
    physical: { barcode: "TEST-GTIN-099", visible_text: "Café Torrado 500 g", unit_observed: "UN", quantity_observed: 10 },
    candidates: [
      { record_id: "CAT-003", gtin: "TEST-GTIN-003", description: "Café torrado 500g", unit: "UN", pack_size: 0.5 },
      { record_id: "CAT-099", gtin: "TEST-GTIN-099", description: "Café Torrado 500g embalagem alternativa", unit: "UN", pack_size: 0.5 }
    ]
  });
  assert.equal(result.status, "CONFLICT");
  assert.deepEqual(result.entities, []);
});

test("SYN-005 blocks auto-resolution when received quantity differs from document", () => {
  const result = resolveReceiving({
    id: "SYN-005",
    documentLine: { gtin: "TEST-GTIN-005", description: "Água mineral 1,5L", unit: "UN", quantity: 24 },
    physical: { barcode: "TEST-GTIN-005", visible_text: "Água Mineral 1,5 L", unit_observed: "UN", quantity_observed: 22 },
    candidates: [{ record_id: "CAT-005", gtin: "TEST-GTIN-005", description: "Água Mineral 1,5L", unit: "UN", pack_size: 1.5 }]
  });
  assert.equal(result.status, "CONFLICT");
  assert.deepEqual(result.entities, []);
});

test("SYN-006 requires review when declared and observed units differ", () => {
  const result = resolveReceiving({
    id: "SYN-006",
    documentLine: { gtin: "TEST-GTIN-006", description: "Copo descartável 200 ml", unit: "CX", quantity: 4 },
    physical: { barcode: "TEST-GTIN-006", visible_text: "Copo descartável 200ml", unit_observed: "PCT", quantity_observed: 4 },
    candidates: [{ record_id: "CAT-006", gtin: "TEST-GTIN-006", description: "Copo descartável 200ml", unit: "CX", pack_size: 100 }]
  });
  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.deepEqual(result.entities, []);
});

test("SYN-008 distinguishes missing catalog item from generic uncertainty", () => {
  const result = resolveReceiving({
    id: "SYN-008",
    documentLine: { gtin: "TEST-GTIN-008", description: "Esponja multiuso 3 unidades", unit: "PCT", quantity: 15 },
    physical: { barcode: "TEST-GTIN-008", visible_text: "Esponja Multiuso 3un", unit_observed: "PCT", quantity_observed: 15 },
    candidates: []
  });
  assert.equal(result.status, "NOT_FOUND");
});

test("SYN-009 blocks auto-resolution when product pack descriptions conflict", () => {
  const result = resolveReceiving({
    id: "SYN-009",
    documentLine: { gtin: "TEST-GTIN-009", description: "Amaciante 2L", unit: "UN", quantity: 6 },
    physical: { barcode: "TEST-GTIN-009", visible_text: "Amaciante concentrado 1L", unit_observed: "UN", quantity_observed: 6 },
    candidates: [{ record_id: "CAT-009", gtin: "TEST-GTIN-009", description: "Amaciante 2L", unit: "UN", pack_size: 2 }]
  });
  assert.equal(result.status, "CONFLICT");
  assert.deepEqual(result.entities, []);
});

test("SYN-011 preserves camera failure as a technical outcome", () => {
  const result = resolveReceiving({
    id: "SYN-011",
    documentLine: { gtin: "TEST-GTIN-011", description: "Limpador multiuso 500ml", unit: "UN", quantity: 5 },
    physical: { capture_status: "FAILED", error_code: "CAMERA_PERMISSION_DENIED" },
    candidates: [{ record_id: "CAT-011", gtin: "TEST-GTIN-011", description: "Limpador multiuso 500ml", unit: "UN", pack_size: 0.5 }]
  });
  assert.equal(result.status, "TECHNICAL_ERROR");
});
