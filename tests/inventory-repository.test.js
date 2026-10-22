import test from "node:test";
import assert from "node:assert/strict";

import { InventoryRepository } from "../core/inventory/repository.js";

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function setup() {
  const storage = new MemoryStorage();
  const repo = new InventoryRepository({ storage, tenantId: "tenant_a" });
  repo.saveProduct({ productId: "p1", name: "Café", unit: "un", state: "CONFIRMED" });
  return { storage, repo };
}

function movement(overrides = {}) {
  return {
    movementId: "m1", productId: "p1", type: "RECEIPT", quantity: 10,
    unit: "un", occurredAt: "2026-10-22T10:00:00Z", source: "test",
    idempotencyKey: "key-m1", state: "CONFIRMED", ...overrides
  };
}

test("persists products and movements across repository instances using the same storage", () => {
  const { storage, repo } = setup();
  repo.recordMovement(movement());
  const reopened = new InventoryRepository({ storage, tenantId: "tenant_a" });
  assert.equal(reopened.getProduct("p1").name, "Café");
  assert.equal(reopened.listMovements().length, 1);
});

test("isolates collections by tenant and rejects cross-tenant records in storage", () => {
  const storage = new MemoryStorage();
  const a = new InventoryRepository({ storage, tenantId: "tenant_a" });
  const b = new InventoryRepository({ storage, tenantId: "tenant_b" });
  a.saveProduct({ productId: "p1", name: "Produto A", unit: "un" });
  b.saveProduct({ productId: "p1", name: "Produto B", unit: "un" });
  assert.equal(a.getProduct("p1").name, "Produto A");
  assert.equal(b.getProduct("p1").name, "Produto B");
});

test("makes repeated movement submission idempotent", () => {
  const { repo } = setup();
  const first = repo.recordMovement(movement());
  const retry = repo.recordMovement(movement());
  assert.equal(first.duplicate, false);
  assert.equal(retry.duplicate, true);
  assert.equal(repo.listMovements().length, 1);
});

test("rejects reuse of an idempotency key with a different payload", () => {
  const { repo } = setup();
  repo.recordMovement(movement());
  assert.throws(() => repo.recordMovement(movement({ quantity: 11 })), /idempotency_key_reused_with_different_payload/);
});

test("rejects movements for unknown products", () => {
  const { repo } = setup();
  assert.throws(() => repo.recordMovement(movement({ productId: "missing" })), /inventory_product_not_found/);
});

test("calculates balance only from accepted movements and reports excluded rows", () => {
  const { repo } = setup();
  repo.recordMovement(movement({ movementId: "in", idempotencyKey: "in", quantity: 10 }));
  repo.recordMovement(movement({ movementId: "out", idempotencyKey: "out", type: "ISSUE", direction: "OUT", quantity: 3 }));
  repo.recordMovement(movement({ movementId: "pending", idempotencyKey: "pending", quantity: 100, state: "IMPORTED" }));
  const balance = repo.getStockBalance("p1");
  assert.equal(balance.quantity, 7);
  assert.equal(balance.includedMovements, 2);
  assert.deepEqual(balance.excludedMovements, [
    { movementId: "pending", state: "IMPORTED", reason: "state_not_accepted" }
  ]);
});

test("applies explicit adjustment direction and excludes ambiguous adjustments", () => {
  const { repo } = setup();
  repo.recordMovement(movement({ movementId: "opening", idempotencyKey: "opening", quantity: 20 }));
  repo.recordMovement(movement({
    movementId: "adjust-in", idempotencyKey: "adjust-in", type: "ADJUSTMENT",
    direction: "ADJUSTMENT", quantity: 2, metadata: { adjustmentDirection: "IN" }
  }));
  repo.recordMovement(movement({
    movementId: "adjust-unknown", idempotencyKey: "adjust-unknown", type: "ADJUSTMENT",
    direction: "ADJUSTMENT", quantity: 50, metadata: {}
  }));
  const balance = repo.getStockBalance("p1");
  assert.equal(balance.quantity, 22);
  assert.ok(balance.excludedMovements.some((item) => item.reason === "adjustment_direction_missing"));
});

test("excludes movements with units different from the product unit", () => {
  const { repo } = setup();
  repo.recordMovement(movement({ unit: "kg" }));
  const balance = repo.getStockBalance("p1");
  assert.equal(balance.quantity, 0);
  assert.equal(balance.excludedMovements[0].reason, "unit_mismatch");
});

test("rejects a record inserted into another tenant's storage namespace", () => {
  const storage = new MemoryStorage();
  const repo = new InventoryRepository({ storage, tenantId: "tenant_a" });
  storage.setItem("3l0.inventory.v0.1:tenant_a:products", JSON.stringify([{ tenantId: "tenant_b", productId: "p2" }]));
  assert.throws(() => repo.listProducts(), /tenant_scope_mismatch/);
});

test("allows an explicit review decision to change the projected balance", () => {
  const { repo } = setup();
  repo.recordMovement(movement({ state: "NEEDS_REVIEW" }));
  assert.equal(repo.getStockBalance("p1").quantity, 0);
  repo.setMovementState("m1", "CONFIRMED");
  assert.equal(repo.getStockBalance("p1").quantity, 10);
  assert.throws(() => repo.setMovementState("m1", "UNKNOWN"), /inventory_movement_state_invalid/);
});
