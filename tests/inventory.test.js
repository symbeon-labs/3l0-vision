import test from "node:test";
import assert from "node:assert/strict";

import {
  assertSameTenant,
  createInventoryEvidence,
  createInventoryProduct,
  createStockMovement
} from "../core/inventory/contracts.js";

test("normalizes a product while preserving source provenance", () => {
  const product = createInventoryProduct({
    tenantId: "tenant_a",
    productId: "product_001",
    sku: "SKU-001",
    name: "Produto de demonstração",
    unit: "un",
    identifiers: [{ scheme: "ean", value: "789000000004" }],
    state: "IMPORTED",
    provenance: { sourceType: "csv", sourceId: "batch_001", actorId: "operator_1" },
    createdAt: "2026-10-22T10:00:00Z"
  });

  assert.equal(product.tenantId, "tenant_a");
  assert.equal(product.identifiers[0].value, "789000000004");
  assert.equal(product.state, "IMPORTED");
  assert.equal(product.provenance.sourceId, "batch_001");
  assert.equal(product.provenance.contractVersion, "inventory.v0.1");
});

test("requires tenant and product identity", () => {
  assert.throws(() => createInventoryProduct({ productId: "p1", name: "Produto" }), /tenantId is required/);
  assert.throws(() => createInventoryProduct({ tenantId: "t1", productId: "p1" }), /name is required/);
});

test("creates an inbound movement with idempotency and evidence references", () => {
  const movement = createStockMovement({
    tenantId: "tenant_a",
    movementId: "move_001",
    productId: "product_001",
    type: "RECEIPT",
    quantity: 12,
    unit: "un",
    occurredAt: "2026-10-22T11:00:00Z",
    source: "manual-entry",
    idempotencyKey: "receipt:tenant_a:doc_123:line_1",
    evidenceIds: ["evidence_001"]
  });

  assert.equal(movement.direction, "IN");
  assert.equal(movement.quantity, 12);
  assert.equal(movement.evidenceIds[0], "evidence_001");
  assert.equal(movement.idempotencyKey, "receipt:tenant_a:doc_123:line_1");
});

test("rejects zero, negative, or non-numeric movement quantities", () => {
  for (const quantity of [0, -1, "not-a-number"]) {
    assert.throws(() => createStockMovement({
      tenantId: "t1",
      movementId: "m1",
      productId: "p1",
      type: "RECEIPT",
      quantity,
      occurredAt: "2026-10-22T11:00:00Z",
      source: "manual",
      idempotencyKey: "key-1"
    }), /quantity must be a finite number greater than zero/);
  }
});

test("rejects unsupported movement types and invalid direction combinations", () => {
  const base = {
    tenantId: "t1", movementId: "m1", productId: "p1", quantity: 1,
    occurredAt: "2026-10-22T11:00:00Z", source: "manual", idempotencyKey: "key-1"
  };
  assert.throws(() => createStockMovement({ ...base, type: "MAGIC" }), /type must be one of/);
  assert.throws(() => createStockMovement({ ...base, type: "ADJUSTMENT", direction: "IN" }), /ADJUSTMENT movement requires/);
});

test("creates evidence with traceable origin and content references", () => {
  const evidence = createInventoryEvidence({
    tenantId: "tenant_a",
    evidenceId: "evidence_001",
    kind: "invoice",
    source: "csv-import",
    capturedAt: "2026-10-22T11:00:00Z",
    contentHash: "sha256:example",
    extractedFields: { invoiceNumber: "NF-123" }
  });

  assert.equal(evidence.kind, "invoice");
  assert.equal(evidence.contentHash, "sha256:example");
  assert.equal(evidence.extractedFields.invoiceNumber, "NF-123");
});

test("prevents cross-tenant records from being accepted by tenant-scoped callers", () => {
  const record = { tenantId: "tenant_a", productId: "p1" };
  assert.equal(assertSameTenant("tenant_a", record), record);
  assert.throws(() => assertSameTenant("tenant_b", record), /tenant_scope_mismatch/);
});


test("rejects unsupported stock movement states", () => {
  assert.throws(() => createStockMovement({
    tenantId: "t1", movementId: "m1", productId: "p1", type: "RECEIPT", quantity: 1,
    occurredAt: "2026-10-22T11:00:00Z", source: "manual", idempotencyKey: "key-1", state: "MAGIC"
  }), /state must be one of/);
});
