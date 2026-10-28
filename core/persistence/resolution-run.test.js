import test from "node:test";
import assert from "node:assert/strict";
import { normalizePersistedStatus, validateResolutionPayload } from "./resolution-run.js";

const validPayload = (overrides = {}) => ({
  workspaceId: "6c20e1e5-9e59-4ff7-94cf-a40bef91e4c4",
  input: { scheme: "GTIN", code: "7891234567890", method: "barcode" },
  output: {
    observation: { source: "synthetic-test" },
    result: { status: "UNCERTAIN", resolutionId: "resolution-test-001" },
    state: "IN_DEVELOPMENT"
  },
  ...overrides
});

test("normalizes all supported persisted statuses", () => {
  for (const status of ["RESOLVED", "UNCERTAIN", "INSUFFICIENT_EVIDENCE", "CONFLICT", "ERROR"]) {
    assert.equal(normalizePersistedStatus(status), status);
  }
});

test("maps legacy statuses to canonical persisted statuses", () => {
  assert.equal(normalizePersistedStatus("REVIEW_REQUIRED"), "UNCERTAIN");
  assert.equal(normalizePersistedStatus("REQUIRES_VERIFICATION"), "UNCERTAIN");
  assert.equal(normalizePersistedStatus("REJECTED_FOR_AUTOMATION"), "UNCERTAIN");
  assert.equal(normalizePersistedStatus("TECHNICAL_ERROR"), "ERROR");
  assert.equal(normalizePersistedStatus("INCOMPLETE"), "INSUFFICIENT_EVIDENCE");
  assert.equal(normalizePersistedStatus("NOT_FOUND"), "INSUFFICIENT_EVIDENCE");
});

test("rejects unsupported status as a client validation error", () => {
  assert.throws(() => normalizePersistedStatus("UNKNOWN"), (error) => error.statusCode === 400);
});

test("trims valid inputs and returns normalized persistence fields", () => {
  const payload = validPayload({
    input: { scheme: " GTIN ", code: " 7891234567890 ", method: " barcode " },
    output: { observation: { ok: true }, result: { status: "REVIEW_REQUIRED", resolution_id: " rid-1 " }, state: " IN_DEVELOPMENT " }
  });
  assert.deepEqual(validateResolutionPayload(payload), {
    scheme: "GTIN",
    code: "7891234567890",
    method: "barcode",
    state: "IN_DEVELOPMENT",
    persistedStatus: "UNCERTAIN",
    resolutionId: "rid-1",
    observation: { ok: true },
    result: { status: "REVIEW_REQUIRED", resolution_id: " rid-1 " }
  });
});

test("rejects invalid workspace identifiers and malformed nested objects", () => {
  assert.throws(() => validateResolutionPayload(validPayload({ workspaceId: "not-a-uuid" })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ output: [] })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ output: { observation: [], result: {}, state: "ok" } })), (error) => error.statusCode === 400);
});

test("rejects blank and oversized input fields", () => {
  assert.throws(() => validateResolutionPayload(validPayload({ input: { scheme: " ", code: "x", method: "manual" } })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ input: { scheme: "x".repeat(41), code: "x", method: "manual" } })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ input: { scheme: "GTIN", code: "x".repeat(129), method: "manual" } })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ output: { observation: {}, result: { status: "UNCERTAIN" }, state: " ".repeat(121) } })), (error) => error.statusCode === 400);
});

test("rejects unsupported input method and oversized resolution id", () => {
  assert.throws(() => validateResolutionPayload(validPayload({ input: { scheme: "GTIN", code: "x", method: "qr" } })), (error) => error.statusCode === 400);
  assert.throws(() => validateResolutionPayload(validPayload({ output: { observation: {}, result: { status: "UNCERTAIN", resolutionId: "r".repeat(129) }, state: "ok" })), (error) => error.statusCode === 400);
});

test("uses a generated ID when the caller supplies no resolution ID", () => {
  assert.equal(validateResolutionPayload(validPayload({ output: { observation: {}, result: { status: "UNCERTAIN" }, state: "ok" } })).resolutionId, null);
});
