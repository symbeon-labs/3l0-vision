import {
  assertSameTenant,
  createInventoryEvidence,
  createInventoryProduct,
  createStockMovement
} from "./contracts.js";

const COLLECTIONS = Object.freeze({ products: "products", movements: "movements", evidence: "evidence" });

/**
 * Tenant-scoped repository backed by an injected storage adapter.
 * localStorage is suitable for a single-browser prototype only; production
 * multi-user deployments require server-side authorization and persistence.
 */
export class InventoryRepository {
  constructor({ storage, tenantId } = {}) {
    if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
      throw new Error("storage adapter with getItem/setItem is required");
    }
    if (!tenantId || !String(tenantId).trim()) throw new Error("tenantId is required");
    this.storage = storage;
    this.tenantId = String(tenantId).trim();
  }

  listProducts() {
    return this.read(COLLECTIONS.products);
  }

  getProduct(productId) {
    return this.listProducts().find((record) => record.productId === productId) ?? null;
  }

  saveProduct(input) {
    const product = createInventoryProduct({ ...input, tenantId: this.tenantId });
    const records = this.read(COLLECTIONS.products);
    const index = records.findIndex((record) => record.productId === product.productId);
    if (index >= 0) records[index] = { ...records[index], ...product, createdAt: records[index].createdAt };
    else records.push(product);
    this.write(COLLECTIONS.products, records);
    return product;
  }

  listMovements({ productId } = {}) {
    return this.read(COLLECTIONS.movements)
      .filter((record) => !productId || record.productId === productId)
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt) || a.movementId.localeCompare(b.movementId));
  }

  recordMovement(input) {
    const movement = createStockMovement({ ...input, tenantId: this.tenantId });
    if (!this.getProduct(movement.productId)) throw new Error("inventory_product_not_found");
    const records = this.read(COLLECTIONS.movements);
    const duplicate = records.find((record) => record.idempotencyKey === movement.idempotencyKey);
    if (duplicate) {
      if (canonical(duplicate) === canonical(movement)) return { movement: duplicate, duplicate: true };
      throw new Error("idempotency_key_reused_with_different_payload");
    }
    if (records.some((record) => record.movementId === movement.movementId)) throw new Error("movement_id_already_exists");
    records.push(movement);
    this.write(COLLECTIONS.movements, records);
    return { movement, duplicate: false };
  }

  setMovementState(movementId, state) {
    const allowedStates = ["CONFIRMED", "IMPORTED", "ESTIMATED", "CONFLICTING", "NEEDS_REVIEW"];
    if (!allowedStates.includes(state)) throw new Error("inventory_movement_state_invalid");
    const records = this.read(COLLECTIONS.movements);
    const index = records.findIndex((record) => record.movementId === movementId);
    if (index < 0) throw new Error("inventory_movement_not_found");
    records[index] = { ...records[index], state };
    this.write(COLLECTIONS.movements, records);
    return records[index];
  }

  listEvidence() {
    return this.read(COLLECTIONS.evidence);
  }

  saveEvidence(input) {
    const evidence = createInventoryEvidence({ ...input, tenantId: this.tenantId });
    const records = this.read(COLLECTIONS.evidence);
    const existing = records.find((record) => record.evidenceId === evidence.evidenceId);
    if (existing) {
      if (canonical(existing) === canonical(evidence)) return { evidence: existing, duplicate: true };
      throw new Error("evidence_id_already_exists");
    }
    records.push(evidence);
    this.write(COLLECTIONS.evidence, records);
    return { evidence, duplicate: false };
  }

  getStockBalance(productId, { acceptedStates = ["CONFIRMED"] } = {}) {
    const product = this.getProduct(productId);
    if (!product) throw new Error("inventory_product_not_found");
    let quantity = 0;
    let includedMovements = 0;
    const excludedMovements = [];

    for (const movement of this.listMovements({ productId })) {
      if (!acceptedStates.includes(movement.state)) {
        excludedMovements.push({ movementId: movement.movementId, state: movement.state, reason: "state_not_accepted" });
        continue;
      }
      if (movement.unit !== product.unit) {
        excludedMovements.push({ movementId: movement.movementId, state: movement.state, reason: "unit_mismatch" });
        continue;
      }
      if (movement.type === "ADJUSTMENT") {
        const adjustmentDirection = movement.metadata?.adjustmentDirection;
        if (!["IN", "OUT"].includes(adjustmentDirection)) {
          excludedMovements.push({ movementId: movement.movementId, state: movement.state, reason: "adjustment_direction_missing" });
          continue;
        }
        quantity += adjustmentDirection === "IN" ? movement.quantity : -movement.quantity;
      } else {
        quantity += movement.direction === "IN" ? movement.quantity : -movement.quantity;
      }
      includedMovements += 1;
    }

    return {
      tenantId: this.tenantId,
      productId,
      unit: product.unit,
      quantity,
      includedMovements,
      excludedMovements,
      policy: { acceptedStates: [...acceptedStates], version: "stock-balance.v0.1" }
    };
  }

  read(collection) {
    const key = this.key(collection);
    let value;
    try {
      value = this.storage.getItem(key);
      if (value === null) return [];
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) throw new Error("invalid_inventory_collection");
      return parsed.map((record) => assertSameTenant(this.tenantId, record));
    } catch (error) {
      if (["tenant_scope_mismatch", "invalid_inventory_collection"].includes(error?.message)) throw error;
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

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
