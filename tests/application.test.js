import test from "node:test";
import assert from "node:assert/strict";
import { createObservation } from "../core/observations/observation.js";

test("application capture payload can be normalized as an observation", () => {
  const observation = createObservation({
    observationId: "obs_capture_001",
    observedAt: "2026-09-30T12:00:00Z",
    source: "3l0-camera",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: "789000001" }]
  });

  assert.equal(observation.modality, "barcode");
  assert.equal(observation.identifiers[0].scheme, "ean");
});
