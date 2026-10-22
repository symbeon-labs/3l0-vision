import test from "node:test";
import assert from "node:assert/strict";
import { applyTargetMapping } from "../core/interoperability/target-mapping.js";

const mapping = {
  id: "case01-demo-erp",
  version: "1.0.0",
  targetSystem: "ERP-DEMO",
  fields: [
    { source: "attributes.name", target: "product.description", required: true, transform: "trim" },
    { source: "identifiers.0.value", target: "product.barcode", required: false },
    { source: "attributes.unit", target: "product.unit", required: true }
  ]
};

test("maps resolved canonical data to a reviewable target payload with provenance", () => {
  const result = applyTargetMapping({
    canonicalRecord: {
      entity_id: "product-1",
      attributes: { name: "  Bebida  ", unit: "UN" },
      identifiers: [{ value: "789123" }]
    },
    resolutionStatus: "RESOLVED",
    mapping,
    sourceProvenance: { "attributes.name": { source: "catalog", ref: "record-1" } }
  });

  assert.equal(result.status, "REVIEW_REQUIRED");
  assert.deepEqual(result.output, {
    product: { description: "Bebida", barcode: "789123", unit: "UN" }
  });
  assert.equal(result.mapping_version, "1.0.0");
  assert.equal(result.live_write, false);
  assert.deepEqual(result.fields[0].provenance, { source: "catalog", ref: "record-1" });
});

test("blocks mapping when resolution is uncertain or conflicting", () => {
  for (const resolutionStatus of ["UNCERTAIN", "CONFLICT", "TECHNICAL_ERROR", undefined]) {
    const result = applyTargetMapping({
      canonicalRecord: { attributes: { name: "Bebida" } },
      resolutionStatus,
      mapping
    });
    assert.equal(result.status, "BLOCKED_UNRESOLVED");
    assert.equal(result.output, null);
  }
});

test("does not invent missing required values", () => {
  const result = applyTargetMapping({
    canonicalRecord: { attributes: { name: "Bebida" }, identifiers: [] },
    resolutionStatus: "RESOLVED",
    mapping
  });

  assert.equal(result.status, "INVALID_MAPPING_INPUT");
  assert.deepEqual(result.output, { product: { description: "Bebida" } });
  assert.equal(result.errors[0].code, "required_source_field_missing");
  assert.equal(result.fields.find((field) => field.source === "attributes.unit").status, "MISSING");
});

test("rejects duplicate target paths and unsupported transforms", () => {
  assert.throws(() => applyTargetMapping({
    canonicalRecord: {},
    resolutionStatus: "RESOLVED",
    mapping: { ...mapping, fields: [...mapping.fields, { source: "x", target: "product.description" }] }
  }), /duplicate target path/);

  assert.throws(() => applyTargetMapping({
    canonicalRecord: {},
    resolutionStatus: "RESOLVED",
    mapping: { ...mapping, fields: [{ source: "x", target: "y", transform: "guess" }] }
  }), /unsupported transform/);
});
