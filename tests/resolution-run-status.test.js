import test from "node:test";
import assert from "node:assert/strict";
import { normalizePersistedStatus } from "../core/persistence/resolution-run.js";

test("maps every supported resolver status to the database contract", () => {
  assert.equal(normalizePersistedStatus("RESOLVED"), "RESOLVED");
  assert.equal(normalizePersistedStatus("UNCERTAIN"), "UNCERTAIN");
  assert.equal(normalizePersistedStatus("INSUFFICIENT_EVIDENCE"), "INSUFFICIENT_EVIDENCE");
  assert.equal(normalizePersistedStatus("CONFLICT"), "CONFLICT");
  assert.equal(normalizePersistedStatus("REVIEW_REQUIRED"), "UNCERTAIN");
  assert.equal(normalizePersistedStatus("TECHNICAL_ERROR"), "ERROR");
  assert.equal(normalizePersistedStatus("ERROR"), "ERROR");
});

test("rejects unknown statuses instead of persisting an invalid state", () => {
  assert.throws(() => normalizePersistedStatus("MAGIC_SUCCESS"), /Unsupported resolution status/);
});
