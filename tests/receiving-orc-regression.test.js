import test from "node:test";
import assert from "node:assert/strict";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { createResolutionRequest } from "../core/orc/contracts.js";
import { OrcClient } from "../core/orc/client.js";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";

const scenarios = [
  ["SYN-001", "RESOLVED", "TEST-GTIN-001", "TEST-GTIN-001", 20, 20, "UN", "UN", "Arroz Tipo 1 1kg", "Arroz Tipo 1 1 kg", ["CAT-001"]],
  ["SYN-002", "RESOLVED", "TEST-GTIN-002", "TEST-GTIN-002", 12, 12, "UN", "UN", "Detergente neutro 500 ml", "Detergente Neutro 0,5L", ["CAT-002"]],
  ["SYN-003", "CONFLICT", "TEST-GTIN-003", "TEST-GTIN-099", 10, 10, "UN", "UN", "Café torrado 500g", "Café Torrado 500 g", ["CAT-003", "CAT-099"]],
  ["SYN-004", "REVIEW_REQUIRED", "TEST-GTIN-004", null, 8, 8, "PCT", "PCT", "Papel toalha 2 rolos", "Papel toalha 2 rolos", ["CAT-004"]],
  ["SYN-005", "CONFLICT", "TEST-GTIN-005", "TEST-GTIN-005", 24, 22, "UN", "UN", "Água mineral 1,5L", "Água Mineral 1,5 L", ["CAT-005"]],
  ["SYN-006", "REVIEW_REQUIRED", "TEST-GTIN-006", "TEST-GTIN-006", 4, 4, "CX", "PCT", "Copo descartável 200 ml", "Copo descartável 200ml", ["CAT-006"]],
  ["SYN-007", "CONFLICT", "TEST-GTIN-007", "TEST-GTIN-007", 6, 6, "UN", "UN", "Sabonete líquido 250ml", "Sabonete líquido 250 ml", ["CAT-007A", "CAT-007B"]],
  ["SYN-008", "NOT_FOUND", "TEST-GTIN-008", "TEST-GTIN-008", 15, 15, "PCT", "PCT", "Esponja multiuso 3 unidades", "Esponja Multiuso 3un", []],
  ["SYN-009", "CONFLICT", "TEST-GTIN-009", "TEST-GTIN-009", 6, 6, "UN", "UN", "Amaciante 2L", "Amaciante concentrado 1L", ["CAT-009"]],
  ["SYN-010", "REVIEW_REQUIRED", "TEST-GTIN-010", null, 10, 10, "UN", "UN", "Biscoito água e sal 350g", "Biscoito água e sal 350 g", ["CAT-010"]],
  ["SYN-011", "TECHNICAL_ERROR", "TEST-GTIN-011", null, 5, null, "UN", null, "Limpador multiuso 500ml", "", ["CAT-011"]],
  ["SYN-012", "CONFLICT", "TEST-GTIN-012", "TEST-GTIN-012", 12, 12, "UN", "UN", "Óleo vegetal 900ml", "Óleo vegetal 900ml", ["CAT-012A", "CAT-012B"]]
];

function entity(recordId, gtin) {
  return {
    entity_id: recordId,
    type: "product",
    identifiers: [{ scheme: "ean", value: gtin }],
    attributes: { name: recordId }
  };
}

function fixtureFor(s) {
  const [caseId, expected, declaredGtin, barcode, declaredQty, observedQty, declaredUnit, observedUnit, declaredDescription, visibleText, candidateIds] = s;
  const suffix = caseId.slice(-3);
  const candidates = candidateIds.map((id) => entity(id, id === "CAT-099" ? "TEST-GTIN-099" : declaredGtin));
  return {
    caseId, expected, candidates,
    receiving: {
      document_line: { line_id: `D-${suffix}`, gtin: declaredGtin, description: declaredDescription, unit: declaredUnit, quantity: declaredQty },
      physical_observation: {
        barcode, visible_text: visibleText, unit_observed: observedUnit, quantity_observed: observedQty,
        ...(caseId === "SYN-010" ? { ocr_confidence: "low" } : {}),
        ...(caseId === "SYN-011" ? { capture_status: "FAILED", error_code: "CAMERA_PERMISSION_DENIED" } : {})
      },
      catalog_candidates: candidates.map((item) => ({
        record_id: item.entity_id,
        gtin: item.identifiers[0].value
      }))
    },
    inputCode: barcode ?? declaredGtin
  };
}

async function executeThroughPipeline(fixture, overrides = {}) {
  const seen = { candidateContext: null, persisted: [], stages: [] };
  const pipeline = new ResolutionPipeline({
    orcClient: new OrcClient({ resolver: deterministicResolver }),
    captureAdapter: {
      async capture() {
        return {
          source: "test-receiving-adapter",
          modality: "identifier",
          identifiers: fixture.inputCode ? [{ scheme: "ean", value: fixture.inputCode }] : [],
          context: { capture_method: "test-adapter" }
        };
      }
    },
    entityRepository: {
      async findCandidates({ context }) {
        seen.candidateContext = context;
        return fixture.candidates;
      },
      async persistResolution(entry) { seen.persisted.push(entry); }
    },
    onStage: (stage) => seen.stages.push(stage.name),
    idFactory: (prefix) => `${prefix}_${fixture.caseId}`
  });

  const output = await pipeline.run({
    input: { code: fixture.inputCode ?? "", scheme: "ean", method: "test" },
    question: { type: "receive_goods", target: "product" },
    context: { operation: "receive_goods", receiving: fixture.receiving, request_id: fixture.caseId, ...overrides }
  });
  return { ...output, seen };
}

test("createResolutionRequest preserva o contexto completo de recebimento", () => {
  const receiving = { document_line: { gtin: "GTIN-X" }, physical_observation: { barcode: "GTIN-X" }, catalog_candidates: [] };
  const request = createResolutionRequest({ resolutionId: "res-contract", question: "receiving", context: { operation: "receive_goods", receiving } });
  assert.equal(request.context.operation, "receive_goods");
  assert.deepEqual(request.context.receiving, receiving);
});

for (const scenario of scenarios) {
  test(`${scenario[0]}: pipeline real + OrcClient + deterministicResolver => ${scenario[1]}`, async () => {
    const fixture = fixtureFor(scenario);
    const output = await executeThroughPipeline(fixture);
    assert.equal(output.result.status, fixture.expected);
    assert.equal(output.seen.candidateContext.operation, "receive_goods");
    assert.deepEqual(output.seen.candidateContext.receiving, fixture.receiving);
    assert.ok(output.seen.stages.includes("RESOLVING"));
    assert.ok(output.seen.stages.includes("COMPLETED"));
    if (fixture.expected !== "RESOLVED") {
      assert.equal(output.seen.persisted.length, 0, "estado não resolvido não deve persistir identidade");
    } else {
      assert.equal(output.seen.persisted.length, 1);
      assert.equal(output.seen.persisted[0].context.receiving.document_line.gtin, fixture.receiving.document_line.gtin);
    }
  });
}

test("recebimento sem context.receiving falha fechado mesmo com identificador correspondente", async () => {
  const fixture = fixtureFor(scenarios[0]);
  const output = await executeThroughPipeline({ ...fixture, receiving: undefined });
  assert.equal(output.result.status, "REVIEW_REQUIRED");
  assert.equal(output.seen.persisted.length, 0);
});

test("adaptador de captura não pode sobrescrever o marcador nem o contexto de recebimento", async () => {
  const fixture = fixtureFor(scenarios[0]);
  const output = await executeThroughPipeline(fixture);
  assert.equal(output.observation.context.operation, "receive_goods");
  assert.equal(output.observation.context.capture_method, "test-adapter");
  assert.deepEqual(output.observation.context.receiving, fixture.receiving);
});

import { buildResolutionContext } from "../api/v1/resolve.js";

test("adaptador real da API preserva documento, observação física e operação no contexto ORC", () => {
  const documentLine = { gtin: "789000000004", quantity: 1, unit: "UN", description: "Produto X 500 ml" };
  const physicalObservation = { barcode: "789000000004", quantity_observed: 1, unit_observed: "UN", visible_text: "Produto X 500 ml" };
  const context = buildResolutionContext({
    operation: "receive_goods",
    receivingInput: { document_line: documentLine, physical_observation: physicalObservation },
    receivingDocumentLine: documentLine,
    receivingPhysicalObservation: physicalObservation,
    requestId: "req-test",
    userId: "user-test",
    workspaceId: "workspace-test",
    workspaceRole: "operator"
  });

  assert.equal(context.operation, "receive_goods");
  assert.deepEqual(context.receiving.document_line, documentLine);
  assert.deepEqual(context.receiving.physical_observation, physicalObservation);
  assert.ok(Array.isArray(context.receiving.catalog_candidates));
  assert.ok(context.receiving.catalog_candidates.some((candidate) => candidate.entity_id === "product_demo_001"));
});

test("adaptador real não inventa contexto de recebimento ausente; resolver deve abster-se", async () => {
  const context = buildResolutionContext({
    operation: "receive_goods",
    receivingInput: null,
    requestId: "req-missing",
    userId: "user-test",
    workspaceId: "workspace-test",
    workspaceRole: "operator"
  });
  assert.equal(context.operation, "receive_goods");
  assert.equal("receiving" in context, false);

  const request = createResolutionRequest({
    resolutionId: "res-missing-context",
    question: "receiving",
    entities: [{ entity_id: "product_demo_001", identifiers: [{ scheme: "ean", value: "789000000004" }] }],
    observations: [{ identifiers: [{ scheme: "ean", value: "789000000004" }] }],
    context
  });
  const result = deterministicResolver(request);
  assert.equal(result.status, "REVIEW_REQUIRED");
});
