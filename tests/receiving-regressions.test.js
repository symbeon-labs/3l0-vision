import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";

const fixturePath = fileURLToPath(new URL("./fixtures/receiving-synthetic-cases.json", import.meta.url));
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function resolveCase(item) {
  const { case_id: id, document_line: documentLine, physical_observation: physical, catalog_candidates: candidates } = item;
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

test("CASE-002 fixture is synthetic and contains all 12 scenarios", () => {
  assert.equal(fixture.dataset_type, "synthetic");
  assert.equal(fixture.cases.length, 12);
  assert.deepEqual(fixture.cases.map((item) => item.case_id), Array.from({ length: 12 }, (_, i) => `SYN-${String(i + 1).padStart(3, "0")}`));
});

for (const item of fixture.cases) {
  test(`${item.case_id} matches expected receiving outcome`, () => {
    const result = resolveCase(item);
    assert.equal(result.status, item.expected, `${item.case_id}: expected ${item.expected}, got ${result.status}`);
    if (item.expected === "RESOLVED") {
      assert.deepEqual(result.entities, [item.expected_record_id]);
    } else {
      assert.deepEqual(result.entities, []);
    }
  });
}

test("resolver remains backward-compatible when receiving context is absent", () => {
  const result = deterministicResolver({
    resolution_id: "LEGACY-001",
    question: { type: "entity_resolution" },
    entities: [{ entity_id: "CAT-LEGACY", identifiers: [{ scheme: "gtin", value: "LEGACY-GTIN" }] }],
    observations: [{ identifiers: [{ scheme: "gtin", value: "LEGACY-GTIN" }] }]
  });
  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.entities, ["CAT-LEGACY"]);
});
