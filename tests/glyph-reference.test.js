import test from "node:test";
import assert from "node:assert/strict";

import { normalizeQrIdentifier, parseGlyphReference } from "../core/vision/glyph-reference.js";
import { createObservation } from "../core/observations/observation.js";

test("parses a version 1 Glyph QR reference without claiming identity", () => {
  const parsed = parseGlyphReference("3l0-glyph:v1:prod_12345678");
  assert.deepEqual(parsed, {
    scheme: "3l0-glyph",
    value: "prod_12345678",
    version: 1
  });

  const observation = createObservation({
    observationId: "obs-glyph-001",
    observedAt: "2026-10-21T12:00:00.000Z",
    source: "browser-camera",
    modality: "identifier",
    identifiers: [{ scheme: parsed.scheme, value: parsed.value }],
    context: { glyph: { version: parsed.version, validation: "syntax-only" } }
  });

  assert.equal(observation.identifiers[0].scheme, "3l0-glyph");
  assert.equal(observation.identifiers[0].value, "prod_12345678");
  assert.equal(observation.context.glyph.validation, "syntax-only");
  assert.equal(observation.entity_id, undefined);
});

test("keeps an ordinary QR payload as a generic QR identifier", () => {
  assert.deepEqual(normalizeQrIdentifier("https://example.test/item/123"), {
    scheme: "qr",
    value: "https://example.test/item/123"
  });
  assert.equal(parseGlyphReference("https://example.test/item/123"), null);
});

test("rejects malformed Glyph namespace payloads", () => {
  assert.throws(
    () => parseGlyphReference("3l0-glyph:v1:short"),
    /glyph_reference_invalid_or_unsupported_version/
  );
});

test("rejects unsupported Glyph versions instead of silently treating them as generic QR", () => {
  assert.throws(
    () => parseGlyphReference("3l0-glyph:v2:prod_12345678"),
    /glyph_reference_invalid_or_unsupported_version/
  );
});

test("rejects non-string values at the parser boundary", () => {
  assert.throws(() => parseGlyphReference(null), /glyph_reference_must_be_string/);
});
