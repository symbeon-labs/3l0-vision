import test from "node:test";
import assert from "node:assert/strict";

import { createObservation } from "../core/observations/observation.js";
import { createEntity } from "../core/entities/entity.js";
import { createConfirmation } from "../core/orc/contracts.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { mapResolutionToProductState } from "../core/state/product-state.js";

const DEMO_EAN = "789000000004";

test("normalizes an observation identifier without discarding confidence", () => {
  const observation = createObservation({
    observationId: "obs_001",
    observedAt: "2026-09-30T12:00:00Z",
    source: "camera",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: ` ${DEMO_EAN} `, confidence: 0.99 }],
    evidence: [{ type: "image", ref: "img_001" }],
    context: { operation: "receiving" }
  });

  assert.deepEqual(observation.identifiers[0], {
    scheme: "ean",
    value: DEMO_EAN,
    confidence: 0.99
  });
  assert.deepEqual(observation.evidence, [{ type: "image", ref: "img_001" }]);
  assert.deepEqual(observation.context, { operation: "receiving" });
});

test("resolves a unique deterministic identifier match", async () => {
  const entity = createEntity({
    entityId: "product_001",
    type: "product",
    identifiers: [{ scheme: "ean", value: DEMO_EAN }]
  });

  const observation = createObservation({
    observationId: "obs_002",
    observedAt: "2026-09-30T12:00:00Z",
    source: "scanner",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: DEMO_EAN }]
  });

  const client = new OrcClient({ resolver: deterministicResolver });

  const result = await client.resolve({
    resolutionId: "res_001",
    question: { type: "identify_product", target: "product" },
    entities: [entity],
    observations: [observation]
  });

  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.entities, ["product_001"]);
  assert.equal(result.provenance[0], "deterministic-identifier-match");
  assert.equal(mapResolutionToProductState(result.status), "RESOLVED");
});

test("preserves ambiguity as conflict instead of selecting a winner", () => {
  const entities = [
    createEntity({
      entityId: "product_001",
      identifiers: [{ scheme: "ean", value: DEMO_EAN }]
    }),
    createEntity({
      entityId: "product_002",
      identifiers: [{ scheme: "ean", value: DEMO_EAN }]
    })
  ];

  const observation = createObservation({
    observationId: "obs_003",
    observedAt: "2026-09-30T12:00:00Z",
    source: "scanner",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: DEMO_EAN }]
  });

  const result = deterministicResolver({
    resolution_id: "res_002",
    observations: [observation],
    entities
  });

  assert.equal(result.status, "CONFLICT");
  assert.deepEqual(
    result.conflicts[0].candidates,
    ["product_001", "product_002"]
  );
  assert.equal(mapResolutionToProductState(result.status), "CONFLICT");
});

test("preserves lack of deterministic evidence as uncertainty", () => {
  const result = deterministicResolver({
    resolution_id: "res_003",
    observations: [],
    entities: []
  });

  assert.equal(result.status, "UNCERTAIN");
  assert.equal(mapResolutionToProductState(result.status), "UNCERTAIN");
});

test("maps non-automatable resolution to an explicit attention state", () => {
  assert.equal(
    mapResolutionToProductState("REJECTED_FOR_AUTOMATION"),
    "ATTENTION"
  );
});

test("human confirmation remains an explicit action", () => {
  const confirmation = createConfirmation({
    confirmationId: "conf_001",
    resolutionId: "res_004",
    operatorId: "operator_001",
    confirmedAt: "2026-09-30T12:00:00Z",
    decision: "confirm"
  });

  assert.equal(confirmation.resolution_id, "res_004");
  assert.equal(confirmation.operator_id, "operator_001");
  assert.equal(confirmation.decision, "confirm");
});
