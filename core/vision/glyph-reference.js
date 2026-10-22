const GLYPH_PREFIX = "3l0-glyph:v1:";

/**
 * Parse the canonical, versioned QR payload used by the Gate A prototype.
 * This validates syntax only; it does not look up a registry or prove identity.
 *
 * @returns {{scheme: "3l0-glyph", value: string, version: 1} | null}
 * Returns null for ordinary QR payloads.
 * Throws for malformed payloads that claim to use the Glyph namespace.
 */
export function parseGlyphReference(rawValue) {
  if (typeof rawValue !== "string") {
    throw new TypeError("glyph_reference_must_be_string");
  }

  const value = rawValue.trim();
  if (!value.startsWith("3l0-glyph:")) return null;

  const match = /^3l0-glyph:v1:([A-Za-z0-9_-]{8,128})$/.exec(value);
  if (!match) throw new Error("glyph_reference_invalid_or_unsupported_version");

  return {
    scheme: "3l0-glyph",
    value: match[1],
    version: 1
  };
}

export function normalizeQrIdentifier(rawValue) {
  const glyph = parseGlyphReference(rawValue);
  if (glyph) return { scheme: glyph.scheme, value: glyph.value };
  return { scheme: "qr", value: String(rawValue).trim() };
}
