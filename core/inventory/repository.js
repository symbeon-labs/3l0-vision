import {
  assertSameTenant,
  createInventoryEvidence,
  createInventoryProduct,
  createStockMovement
} from "./contracts.js";

const COLLECTIONS = Object.freeze({
  products: "products",
  movements: "movements",
  evidence: "evidence"
});

/**
 * Tenant-scoped inventory repository backed by an injected storage adapter.
 * Browser deployments may inject localStorage; production multi-user use needs
 * a server-side repository and authorization, not client storage alone.
 */
export class InventoryRepository {
  constructor({ storage, tenantId, idFactory = defaultId } = {}) {
    if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
      throw new Error("storage adapter with getItem/setItem is required");
    }
    if (!tenantId || !String(tenantId).trim()) throw new Error("tenantId is required");
    this.storage = storage;
    this.tenantId = String(tenantId).trim();
    this.idFactory = idFactory;
  }

  listProducts() {
    return this.read(COLLECTIONS.products).map((record) => assertSameTenant(this.tenantId, record));
  }

  getProduct(productId) {
    return this.listProducts().find((record) => record.productId === productId) ?? null;
  }

  saveProduct(input) {
    const product = createInventoryProduct({ ...input, tenantId: this.tenantId });
    const records = this.read(COLLECTIONS.products);
    const existing = records.findIndex((record) => record.productId === product.productId);
    if (existing >= 0) {
      records[existing] = { ...records[existing], ...product, createdAt: records[existing].createdAt };
    } else {
      records.push(product);
    }
    this.write(COLLECTIONS.products, records);
    return product;
  }

  listMovements({ productId } = {}) {
    return this.read(COLLECTIONS.movements)
      .map((record) => assertSameTenant(this.tenantId, record))
      .filter((record) => !productId || record.productId === productId)
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.movementId.localeCompare(b.movementId));
  }

  recordMovement(input) {
    const movement = createStockMovement({ ...input, tenantId: this.tenantId });
    if (!this.getProduct(movement.productId)) throw new Error("inventory_product_not_found");

    const records = this.read(COLLECTIONS.movements);
    const duplicate = records.find((record) =>
      record.tenantId === this.tenantId && record.idempotencyKey === movement.idempotencyKey
    );
    if (duplicate) {
      if (samePayload(duplicate, movement)) return { movement: duplicate, duplicate: true };
      throw new Error("idempotency_key_reused_with_different_payload");
    }
    if (records.some((record) => record.movementId === movement.movementId && record.tenantId === this.tenantId)) {
      throw new Error("movement_id_already_exists");
    }
    records.push(movement);
    this.write(COLLECTIONS.movements, records);
    return { movement, duplicate: false };
  }

  listEvidence() {
    return this.read(COLLECTIONS.evidence).map((record) => assertSameTenant(this.tenantId, record));
  }

  saveEvidence(input) {
    const evidence = createInventoryEvidence({ ...input, tenantId: this.tenantId });
    const records = this.read(COLLECTIONS.evidence);
    const existing = records.find((record) => record.evidenceId === evidence.evidenceId && record.tenantId === this.tenantId);
    if (existing) {
      if (samePayload(existing, evidence)) return { evidence: existing, duplicate: true };
      throw new Error("evidence_id_already_exists");
    }
    records.push(evidence);
    this.write(COLLECTIONS.evidence, records);
    return { evidence, duplicate: false };
  }

  getStockBalance(productId, { acceptedStates = ["CONFIRMED"] } = {}) {
    const product = this.getProduct(productId);
    if (!product) throw new Error("inventory_product_not_found");

    const movements = this.listMovements({ productId });
    let balance = 0;
    let included = 0;
    const excluded = [];

    for (const movement of movements) {
      if (!acceptedStates.includes(movement.state)) {
        excluded.push({ movementId: movement.movementId, state: movement.state, reason: "state_not_accepted" });
        continue;
      }
      if (movement.unit !== product.unit) {
        excluded.push({ movementId: movement.movementId, state: movement.state, reason: "unit_mismatch" });
        continue;
      }
      if (movement.type === "ADJUSTMENT") {
        const adjustmentDirection = movement.metadata?.adjustmentDirection;
        if (!["IN", "OUT"].includes(adjustmentDirection)) {
          excluded.push({ movementId: movement.movementId, state: movement.state, reason: "adjustment_direction_missing" });
          continue;
        }
        balance += adjustmentDirection === "IN" ? movement.quantity : -movement.quantity;
      } else {
        balance += movement.direction === "IN" ? movement.quantity : -movement.quantity;
      }
      included += 1;
    }

    return {
      tenantId: this.tenantId,
      productId,
      unit: product.unit,
      quantity: balance,
      includedMovements: included,
      excludedMovements: excluded,
      policy: { acceptedStates: [...acceptedStates], version: "stock-balance.v0.1" }
    };
  }

  read(collection) {
    const key = this.key(collection);
    try {
      const value = this.storage.getItem(key);
      if (value === null) return [];
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("invalid_inventory_collection");
      return parsed.map((record) => assertSameTenant(this.tenantId, record));
    } catch (error) {
      if (error?.message === "tenant_scope_mismatch" || error?.message === "invalid_inventory_collection") throw error;
      throw new Error("inventory_storage_read_failed", { cause: error });
    }
  }

  write(collection, records) {
    this.storage.setItem(this.key(collection), JSON.stringify(records));
  }

  key(collection) {
    return `3l0.inventory.v0.1:${encodeURIComponent(this.tenantId)}:${collection}`;
  }
}

function samePayload(left, right) {
  const stable = (value) => JSON.stringify(value, Object.keys(value).sort());
  return stable(left) === stable(right);
}

function defaultId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
