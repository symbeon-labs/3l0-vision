import test from "node:test";
import assert from "node:assert/strict";

import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { createEntity } from "../core/entities/entity.js";

const DEMO_EAN = "789000000004";

test("runs the phase 1 vertical slice from capture to persistence", async () => {
  const stages = [];
  const persisted = [];

  const entity = createEntity({
    entityId: "product_001",
    type: "product",
    identifiers: [{ scheme: "ean", value: DEMO_EAN }],
    attributes: { name: "Produto X" }
  });

  const pipeline = new ResolutionPipeline({
    captureAdapter: {
      async capture() {
        return {
          source: "camera",
          modality: "barcode",
          identifiers: [{ scheme: "ean", value: DEMO_EAN }],
          evidence: [{ type: "image", ref: "capture_001" }]
        };
      }
    },
    entityRepository: {
      async findCandidates() {
        return [entity];
      },
      async persistResolution(record) {
        persisted.push(record);
      }
    },
    orcClient: new OrcClient({ resolver: deterministicResolver }),
    idFactory: (prefix) => prefix + "_test",
    onStage: (event) => stages.push(event.name)
  });

  const output = await pipeline.run({
    input: { device: "test-camera" },
    context: { operation: "receiving" }
  });

  assert.equal(output.result.status, "RESOLVED");
  assert.equal(output.state, "RESOLVED");
  assert.deepEqual(persisted.map((item) => item.entityId), ["product_001"]);
  assert.deepEqual(stages, [
    "CAPTURING",
    "OBSERVING",
    "NORMALIZING",
    "RESOLVING",
    "RESOLVED",
    "COMPLETED"
  ]);
  assert.deepEqual(output.observation.evidence, [
    { type: "image", ref: "capture_001" }
  ]);
});

test("does not persist an uncertain resolution", async () => {
  let persisted = false;

  const pipeline = new ResolutionPipeline({
    captureAdapter: {
      async capture() {
        return {
          source: "manual",
          modality: "code",
          identifiers: [{ scheme: "ean", value: "not-in-catalog" }]
        };
      }
    },
    entityRepository: {
      async findCandidates() {
        return [];
      },
      async persistResolution() {
        persisted = true;
      }
    },
    orcClient: new OrcClient({ resolver: deterministicResolver }),
    idFactory: (prefix) => prefix + "_test"
  });

  const output = await pipeline.run({ input: { code: "not-in-catalog" } });

  assert.equal(output.result.status, "UNCERTAIN");
  assert.equal(output.state, "UNCERTAIN");
  assert.equal(persisted, false);
});
