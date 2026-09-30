import test from "node:test";
import assert from "node:assert/strict";

import { createVisionObservation } from "../core/vision/observation.js";
import { normalizeBarcodeObservation } from "../core/vision/barcode-provider.js";
import { VisionProviderRegistry } from "../core/vision/registry.js";
import { VisionProvider } from "../core/vision/provider.js";

test("vision observations preserve provider provenance without creating identity", () => {
  const observation = createVisionObservation({
    observationId: "obs-vision-001",
    observedAt: "2026-09-30T12:00:00Z",
    source: "camera",
    provider: "browser-barcode",
    imageReference: "frame://001",
    identifiers: [{ scheme: "ean", value: "789000001", confidence: 0.99 }],
    detections: [{ type: "package", confidence: 0.82 }]
  });

  assert.equal(observation.identifiers[0].value, "789000001");
  assert.equal(observation.metadata.vision_provider, "browser-barcode");
  assert.equal(observation.evidence[0].type, "image");
  assert.equal(observation.context.detections[0].type, "package");
  assert.equal(observation.entity_id, undefined);
});

test("barcode normalization maps common formats to observation identifiers", () => {
  const observation = normalizeBarcodeObservation({
    observationId: "obs-barcode-001",
    observedAt: "2026-09-30T12:00:00Z",
    provider: "browser-barcode",
    value: "789000001",
    format: "ean_13",
    confidence: 0.98
  });

  assert.deepEqual(observation.identifiers[0], {
    scheme: "ean",
    value: "789000001",
    confidence: 0.98
  });
});

test("vision provider registry keeps providers replaceable", () => {
  class DemoProvider extends VisionProvider {
    constructor() {
      super({ name: "demo", modality: "ocr", version: "1" });
    }
  }

  const registry = new VisionProviderRegistry();
  registry.register(new DemoProvider());

  assert.deepEqual(registry.list(), [
    { provider: "demo", modality: "ocr", version: "1" }
  ]);
  assert.equal(registry.get("demo").name, "demo");
});
