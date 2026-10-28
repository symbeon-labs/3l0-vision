import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { LocalCatalog } from "../app/catalog/local-catalog.js";

const fixturePath = fileURLToPath(new URL("./fixtures/receiving-synthetic-cases.json", import.meta.url));
const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

function installMemoryLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    clear() { values.clear(); }
  };
  return globalThis.localStorage;
}

function catalogEntities(cases) {
  const byId = new Map();
  for (const item of cases) {
    for (const candidate of item.catalog_candidates) {
      byId.set(candidate.record_id, {
        entity_id: candidate.record_id,
        type: "product",
        identifiers: candidate.gtin ? [{ scheme: "gtin", value: candidate.gtin }] : [],
        attributes: {
          name: candidate.description,
          unit: candidate.unit,
          pack_size: candidate.pack_size
        }
      });
    }
  }
  return [...byId.values()];
}

function createSystemPipeline(item, catalog) {
  const physical = item.physical_observation;
  const captureAdapter = {
    async capture(input) {
      // Camera intentionally excluded. This adapter supplies the same normalized
      // barcode/text/receiving signals that the capture boundary would emit.
      return {
        source: "synthetic-non-camera-adapter",
        modality: physical.barcode ? "barcode-plus-receiving-context" : "text-plus-receiving-context",
        identifiers: physical.barcode ? [{ scheme: "gtin", value: physical.barcode }] : [],
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
          },
          operation: "receiving",
          test_case_id: input.case_id
        }
      };
    }
  };

  return new ResolutionPipeline({
    captureAdapter,
    entityRepository: catalog,
    orcClient: new OrcClient({ resolver: deterministicResolver }),
    idFactory: (prefix) => `${prefix}_${item.case_id}`
  });
}

test("system integration: all 12 CASE-002 cases run through the real pipeline, ORC, local catalog and persistence adapter (camera excluded)", async () => {
  assert.equal(fixture.dataset_type, "synthetic");
  assert.equal(fixture.cases.length, 12);

  const results = [];
  for (const item of fixture.cases) {
    const storage = installMemoryLocalStorage();
    storage.setItem("3l0.catalog.v1", JSON.stringify(catalogEntities(fixture.cases)));
    const catalog = new LocalCatalog();
    const pipeline = createSystemPipeline(item, catalog);

    const output = await pipeline.run({
      input: { case_id: item.case_id },
      question: { type: "receiving_reconciliation", target: "product" },
      context: { operation: "receiving", test_case_id: item.case_id }
    });

    assert.equal(output.result.status, item.expected, `${item.case_id}: expected ${item.expected}, got ${output.result.status}`);
    assert.ok(output.observation.observation_id);
    assert.ok(output.observation.context.receiving, `${item.case_id}: receiving context missing`);

    if (item.expected === "RESOLVED") {
      assert.equal(output.state, "RESOLVED");
      const savedCatalog = JSON.parse(storage.getItem("3l0.catalog.v1"));
      assert.ok(savedCatalog.some((entity) => entity.entity_id === output.result.entities[0]), `${item.case_id}: catalog persistence path not exercised`);
      if (item.expected_record_id) assert.deepEqual(output.result.entities, [item.expected_record_id]);
    } else {
      assert.notEqual(output.result.status, "RESOLVED", `${item.case_id}: unsafe auto-resolution`);
    }

    results.push({ case_id: item.case_id, expected: item.expected, actual: output.result.status });
  }
  assert.equal(results.length, 12);
});

test("system integration: receiving signals from capture override stale request context", async () => {
  const item = fixture.cases.find((entry) => entry.case_id === "SYN-005");
  const storage = installMemoryLocalStorage();
  storage.setItem("3l0.catalog.v1", JSON.stringify(catalogEntities(fixture.cases)));
  const catalog = new LocalCatalog();
  const pipeline = createSystemPipeline(item, catalog);

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
});
