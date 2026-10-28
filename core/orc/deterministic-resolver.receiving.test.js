import test from "node:test";
import assert from "node:assert/strict";
import { deterministicResolver } from "./deterministic-resolver.js";

const product = {
  entity_id: "product-001",
  type: "product",
  identifiers: [{ scheme: "ean", value: "789000000004" }],
  attributes: { name: "Produto de teste", unit: "UN" }
};

function request({ operation = "receive_goods", receiving, code = "789000000004", entities = [product] } = {}) {
  return {
    resolution_id: "res-test-001",
    question: { type: "identify_product", target: "product" },
    entities,
    observations: [{
      identifiers: [{ scheme: "ean", value: code }],
      attributes: {}
    }],
    context: {
      operation,
      ...(receiving === undefined ? {} : { receiving })
    }
  };
}

function receiving(overrides = {}) {
  return {
    document_line: {
      gtin: "789000000004",
      description: "Produto 500 ml",
      unit: "UN",
      quantity: 10
    },
    physical_observation: {
      barcode: "789000000004",
      visible_text: "Produto 500 ml",
      unit_observed: "UN",
      quantity_observed: 10
    },
    catalog_candidates: [product],
    ...overrides
  };
}

test("receiving operation fails closed when receiving context is missing", () => {
  const result = deterministicResolver(request());
  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.ok(result.requires_verification.some(item => item.type === "missing_receiving_context"));
  assert.deepEqual(result.entities, []);
});

test("identifier mismatch between document and physical observation is a conflict", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { ...receiving().physical_observation, barcode: "789000000099" }
    })
  }));
  assert.equal(result.status, "CONFLICT");
  assert.ok(result.conflicts.some(item => item.type === "document_physical_identifier_mismatch"));
});

test("quantity mismatch is a conflict", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { ...receiving().physical_observation, quantity_observed: 9 }
    })
  }));
  assert.equal(result.status, "CONFLICT");
  assert.ok(result.conflicts.some(item => item.type === "quantity_mismatch"));
});

test("unit mismatch requires human review", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { ...receiving().physical_observation, unit_observed: "CX" }
    })
  }));
  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.ok(result.requires_verification.some(item => item.type === "unit_mismatch"));
});

test("pack-size mismatch is a conflict", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { ...receiving().physical_observation, visible_text: "Produto 1 L" }
    })
  }));
  assert.equal(result.status, "CONFLICT");
  assert.ok(result.conflicts.some(item => item.type === "pack_description_mismatch"));
});

test("capture failure remains a technical error", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { capture_status: "FAILED", error_code: "CAMERA_UNAVAILABLE" }
    })
  }));
  assert.equal(result.status, "TECHNICAL_ERROR");
});

test("empty server catalog candidates return not found", () => {
  const result = deterministicResolver(request({
    receiving: receiving({ catalog_candidates: [] })
  }));
  assert.equal(result.status, "NOT_FOUND");
});

test("missing physical identifier requires review instead of resolution", () => {
  const result = deterministicResolver(request({
    receiving: receiving({
      physical_observation: { ...receiving().physical_observation, barcode: null }
    })
  }));
  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.ok(result.requires_verification.some(item => item.type === "physical_identifier_missing"));
});

test("consistent receiving evidence allows deterministic identifier resolution", () => {
  const result = deterministicResolver(request({ receiving: receiving() }));
  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.entities, ["product-001"]);
});

test("ordinary product identification remains compatible without receiving context", () => {
  const result = deterministicResolver(request({ operation: "identify_product" }));
  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.entities, ["product-001"]);
});
