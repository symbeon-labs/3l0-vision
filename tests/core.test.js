import test from "node:test";
import assert from "node:assert/strict";

import { createObservation } from "../core/observations/observation.js";
import { createEntity } from "../core/entities/entity.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { mapResolutionToProductState } from "../core/state/product-state.js";

test("resolves an observation against an existing entity", async () => {
  const entity = createEntity({
    entityId: "ent_product_001",
    type: "product",
    identifiers: [{ scheme: "ean", value: "789000001" }]
  });

  const observation = createObservation({
    observationId: "obs_001",
    observedAt: "2026-09-30T12:00:00Z",
    source: "camera",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: "789000001" }]
  });

  const client = new OrcClient({ resolver: deterministicResolver });

  const result = await client.resolve({
    resolutionId: "res_001",
    question: { type: "identify_product", target: "product" },
    entities: [entity],
    observations: [observation]
  });

  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.entities, ["ent_product_001"]);
  assert.equal(mapResolutionToProductState(result.status), "RESOLVED");
});

test("returns uncertainty when no identifier matches", async () => {
  const client = new OrcClient({ resolver: deterministicResolver });

  const result = await client.resolve({
    resolutionId: "res_002",
    question: { type: "identify_product", target: "product" },
    entities: [],
    observations: [{
      observation_id: "obs_002",
      identifiers: [{ scheme: "ean", value: "999" }]
    }]
  });

  assert.equal(result.status, "UNCERTAIN");
  assert.equal(mapResolutionToProductState(result.status), "UNCERTAIN");
});

test("returns conflict when one observation matches multiple entities", async () => {
  const observation = {
    observation_id: "obs_003",
    identifiers: [{ scheme: "ean", value: "789" }]
  };

  const result = deterministicResolver({
    resolution_id: "res_003",
    question: { type: "identify_product", target: "product" },
    entities: [
      createEntity({ entityId: "a", identifiers: [{ scheme: "ean", value: "789" }] }),
      createEntity({ entityId: "b", identifiers: [{ scheme: "ean", value: "789" }] })
    ],
    observations: [observation]
  });

  assert.equal(result.status, "CONFLICT");
  assert.equal(mapResolutionToProductState(result.status), "CONFLICT");
});
