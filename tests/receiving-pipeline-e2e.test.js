import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";

const fixturePath = fileURLToPath(new URL("./fixtures/receiving-synthetic-cases.json", import.meta.url));
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function createReceivingPipeline(item) {
  const persisted = [];
  const physical = item.physical_observation;
  const candidates = item.catalog_candidates.map((candidate) => ({
    entity_id: candidate.record_id,
    type: "product",
    identifiers: candidate.gtin ? [{ scheme: "gtin", value: candidate.gtin }] : [],
    attributes: {
      name: candidate.description,
      unit: candidate.unit,
      pack_size: candidate.pack_size
    }
  }));

  const pipeline = new ResolutionPipeline({
    captureAdapter: {
      async capture() {
        return {
          source: "synthetic-receiving-adapter",
          modality: "receiving-observation",
          identifiers: physical.barcode
            ? [{ scheme: "gtin", value: physical.barcode }]
            : [],
          text: physical.visible_text ? [physical.visible_text] : [],
          attributes: {
            unit_observed: physical.unit_observed ?? null,
            quantity_observed: physical.quantity_observed ?? null
          },
          context: {
            receiving: {
              document_line: item.document_line,
              physical_observation: physical,
              catalog_candidates: item.catalog_candidates
            }
          }
        };
      }
    },
    entityRepository: {
      async findCandidates({ context }) {
        assert.ok(context.receiving, "capture context must reach candidate lookup");
        return candidates;
      },
      async persistResolution(record) {
        persisted.push(record);
      }
    },
    orcClient: new OrcClient({ resolver: deterministicResolver }),
    idFactory: (prefix) => `${prefix}_${item.case_id}`
  });

  return { pipeline, persisted };
}

test("E2E harness runs every CASE-002 scenario through capture adapter → observation → candidate lookup → ORC → state → persistence gate", async () => {
  assert.equal(fixture.dataset_type, "synthetic");
  assert.equal(fixture.cases.length, 12);

  const results = [];
  for (const item of fixture.cases) {
    const { pipeline, persisted } = createReceivingPipeline(item);
    const output = await pipeline.run({
      input: { case_id: item.case_id },
      question: { type: "receiving_reconciliation", target: "product" },
      context: { operation: "receiving", test_case_id: item.case_id }
    });

    assert.equal(
      output.result.status,
      item.expected,
      `${item.case_id}: expected ${item.expected}, got ${output.result.status}`
    );
    assert.ok(output.observation.observation_id);
    assert.ok(output.observation.context.receiving, `${item.case_id}: capture context missing from observation`);

    if (item.expected === "RESOLVED") {
      assert.equal(output.state, "RESOLVED");
      assert.equal(persisted.length, 1, `${item.case_id}: valid match should pass persistence gate`);
      if (item.expected_record_id) {
        assert.equal(persisted[0].entityId, item.expected_record_id);
      }
    } else {
      assert.equal(persisted.length, 0, `${item.case_id}: non-resolved case must not be persisted as resolved`);
      assert.ok(["ATTENTION", "CONFLICT", "UNCERTAIN"].includes(output.state));
    }

    results.push({ case_id: item.case_id, expected: item.expected, actual: output.result.status, persisted: persisted.length });
  }

  assert.equal(results.length, 12);
});

test("capture-derived receiving context overrides stale request receiving context", async () => {
  const item = fixture.cases.find((entry) => entry.case_id === "SYN-005");
  const { pipeline, persisted } = createReceivingPipeline(item);
  const output = await pipeline.run({
    input: { case_id: item.case_id },
    question: { type: "receiving_reconciliation", target: "product" },
    context: {
      operation: "receiving",
      receiving: {
        document_line: { gtin: "STALE", description: "Old item", unit: "UN", quantity: 1 },
        physical_observation: { barcode: "STALE", unit_observed: "UN", quantity_observed: 1 },
        catalog_candidates: []
      }
    }
  });

  assert.equal(output.result.status, "CONFLICT");
  assert.equal(persisted.length, 0);
});
