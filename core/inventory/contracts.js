/**
 * Canonical inventory contracts for the first 3L0 Vision stock workflow.
 *
 * This module validates and normalizes domain records only. It does not persist
 * data, authorize actors, or claim that an observed value is verified.
 */

export const INVENTORY_RECORD_STATES = Object.freeze([
  "CONFIRMED",
  "IMPORTED",
  "ESTIMATED",
  "CONFLICTING",
  "NEEDS_REVIEW"
]);

export const STOCK_MOVEMENT_TYPES = Object.freeze([
  "OPENING_BALANCE",
  "RECEIPT",
  "ISSUE",
  "ADJUSTMENT",
  "RETURN",
  "TRANSFER_IN",
  "TRANSFER_OUT"
]);

export function createInventoryProduct(input = {}) {
  const tenantId = requiredString(input.tenantId, "tenantId");
  const productId = requiredString(input.productId, "productId");
  const sku = optionalString(input.sku);
  const name = requiredString(input.name, "name");
  const unit = requiredString(input.unit ?? "unit", "unit");
  const state = input.state ?? "NEEDS_REVIEW";
  assertEnum(state, INVENTORY_RECORD_STATES, "state");

  return {
    tenantId,
    productId,
    sku,
    name,
    unit,
    state,
    identifiers: normalizeIdentifiers(input.identifiers ?? []),
    attributes: cloneRecord(input.attributes ?? {}, "attributes"),
    provenance: createProvenance(input.provenance),
    createdAt: isoDate(input.createdAt ?? new Date().toISOString(), "createdAt"),
    updatedAt: isoDate(input.updatedAt ?? input.createdAt ?? new Date().toISOString(), "updatedAt")
  };
}

export function createStockMovement(input = {}) {
  const tenantId = requiredString(input.tenantId, "tenantId");
  const movementId = requiredString(input.movementId, "movementId");
  const productId = requiredString(input.productId, "productId");
  const type = input.type;
  assertEnum(type, STOCK_MOVEMENT_TYPES, "type");

  const quantity = Number(input.quantity);
  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error("quantity must be a finite number greater than zero");
  }

  const state = input.state ?? "NEEDS_REVIEW";
  assertEnum(state, INVENTORY_RECORD_STATES, "state");

  const direction = input.direction ?? (
    ["RECEIPT", "RETURN", "TRANSFER_IN", "OPENING_BALANCE"].includes(type) ? "IN" :
    ["ISSUE", "TRANSFER_OUT"].includes(type) ? "OUT" : null
  );
  if (!["IN", "OUT", "ADJUSTMENT"].includes(direction)) {
    throw new Error("direction must be IN, OUT, or ADJUSTMENT");
  }
  if (type === "ADJUSTMENT" && direction !== "ADJUSTMENT") {
    throw new Error("ADJUSTMENT movement requires ADJUSTMENT direction");
  }
  const expectedDirection = {
    OPENING_BALANCE: "IN",
    RECEIPT: "IN",
    ISSUE: "OUT",
    RETURN: "IN",
    TRANSFER_IN: "IN",
    TRANSFER_OUT: "OUT"
  }[type];
  if (expectedDirection && direction !== expectedDirection) {
    throw new Error(`${type} movement requires ${expectedDirection} direction`);
  }

  return {
    tenantId,
    movementId,
    productId,
    type,
    direction,
    quantity,
    unit: requiredString(input.unit ?? "unit", "unit"),
    occurredAt: isoDate(input.occurredAt, "occurredAt"),
    source: requiredString(input.source, "source"),
    sourceReference: optionalString(input.sourceReference),
    idempotencyKey: requiredString(input.idempotencyKey, "idempotencyKey"),
    state,
    evidenceIds: normalizeStringArray(input.evidenceIds ?? [], "evidenceIds"),
    provenance: createProvenance(input.provenance),
    metadata: cloneRecord(input.metadata ?? {}, "metadata")
  };
}

export function createInventoryEvidence(input = {}) {
  return {
    tenantId: requiredString(input.tenantId, "tenantId"),
    evidenceId: requiredString(input.evidenceId, "evidenceId"),
    kind: requiredString(input.kind, "kind"),
    source: requiredString(input.source, "source"),
    capturedAt: isoDate(input.capturedAt, "capturedAt"),
    contentRef: optionalString(input.contentRef),
    contentHash: optionalString(input.contentHash),
    extractedFields: cloneRecord(input.extractedFields ?? {}, "extractedFields"),
    provenance: createProvenance(input.provenance),
    metadata: cloneRecord(input.metadata ?? {}, "metadata")
  };
}

export function assertSameTenant(tenantId, record) {
  if (!tenantId || !record || record.tenantId !== tenantId) {
    throw new Error("tenant_scope_mismatch");
  }
  return record;
}

function createProvenance(input = {}) {
  const value = input ?? {};
  return {
    sourceType: optionalString(value.sourceType) ?? "manual",
    sourceId: optionalString(value.sourceId),
    actorId: optionalString(value.actorId),
    observedAt: value.observedAt ? isoDate(value.observedAt, "provenance.observedAt") : null,
    importedAt: value.importedAt ? isoDate(value.importedAt, "provenance.importedAt") : null,
    contractVersion: optionalString(value.contractVersion) ?? "inventory.v0.1"
  };
}

function normalizeIdentifiers(identifiers) {
  if (!Array.isArray(identifiers)) throw new Error("identifiers must be an array");
  return identifiers.map((identifier) => ({
    scheme: requiredString(identifier?.scheme, "identifier.scheme"),
    value: requiredString(identifier?.value, "identifier.value")
  }));
}

function normalizeStringArray(values, field) {
  if (!Array.isArray(values)) throw new Error(`${field} must be an array`);
  return values.map((value) => requiredString(value, field));
}

function cloneRecord(value, field) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${field} must be an object`);
  }
  return structuredClone(value);
}

function requiredString(value, field) {
  if (value === undefined || value === null || String(value).trim() === "") {
    throw new Error(`${field} is required`);
  }
  return String(value).trim();
}

function optionalString(value) {
  if (value === undefined || value === null || String(value).trim() === "") return null;
  return String(value).trim();
}

function isoDate(value, field) {
  if (!value) throw new Error(`${field} is required`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${field} must be a valid date`);
  return date.toISOString();
}

function assertEnum(value, values, field) {
  if (!values.includes(value)) {
    throw new Error(`${field} must be one of: ${values.join(", ")}`);
  }
}
