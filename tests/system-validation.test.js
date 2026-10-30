import test from "node:test";
import assert from "node:assert/strict";
import { matchInvoiceItemsToCatalog } from "../core/evidence/invoice-catalog-matcher.js";
import { normalizeQrIdentifier, parseGlyphReference } from "../core/vision/glyph-reference.js";

const invoice = (items) => ({ documentType: "NFE_XML", items });

function catalogWith(candidatesByGtin) {
  return {
    async findCandidates({ observation }) {
      const identifier = observation.identifiers[0];
      assert.equal(identifier.scheme, "ean");
      assert.equal(observation.metadata.validation, "parsed_only_not_fiscally_validated");
      return candidatesByGtin[identifier.value] ?? [];
    }
  };
}

test("caminho principal: identificador único produz candidato sem alegar validação fiscal", async () => {
  const result = await matchInvoiceItemsToCatalog(invoice([
    { lineNumber: 1, gtin: "789000000004", description: "Produto X", quantity: 2, total: 19.9 }
  ]), catalogWith({
    "789000000004": [{ entity_id: "product_demo_001", attributes: { name: "Produto X" } }]
  }));

  assert.equal(result.counts.total, 1);
  assert.equal(result.counts.candidates, 1);
  assert.equal(result.items[0].status, "MATCH_CANDIDATE");
  assert.equal(result.items[0].candidates[0].entityId, "product_demo_001");
  assert.equal(result.validation, "identifier_match_only_not_fiscal_or_physical_validation");
});

test("identificador sem correspondência exige revisão, nunca cria correspondência por descrição", async () => {
  const result = await matchInvoiceItemsToCatalog(invoice([
    { lineNumber: 1, gtin: "789111111111", description: "Produto parecido" }
  ]), catalogWith({}));

  assert.equal(result.items[0].status, "NEEDS_REVIEW");
  assert.equal(result.items[0].reason, "no_catalog_match");
  assert.equal(result.counts.needsReview, 1);
});

test("GTIN ausente exige revisão e não consulta o catálogo", async () => {
  let calls = 0;
  const catalog = { async findCandidates() { calls += 1; return []; } };
  const result = await matchInvoiceItemsToCatalog(invoice([
    { lineNumber: 2, gtin: null, description: "Item sem GTIN" }
  ]), catalog);

  assert.equal(calls, 0);
  assert.equal(result.items[0].status, "NEEDS_REVIEW");
  assert.equal(result.items[0].reason, "missing_gtin");
});

test("identificador com múltiplos candidatos sinaliza conflito", async () => {
  const result = await matchInvoiceItemsToCatalog(invoice([
    { lineNumber: 3, gtin: "789222222222", description: "Produto ambíguo" }
  ]), catalogWith({
    "789222222222": [
      { entity_id: "product_a", attributes: { name: "Produto A" } },
      { entity_id: "product_b", attributes: { name: "Produto B" } }
    ]
  }));

  assert.equal(result.items[0].status, "CONFLICT");
  assert.equal(result.items[0].reason, "multiple_catalog_candidates");
  assert.equal(result.counts.conflicts, 1);
});

test("referência Glyph válida é normalizada e versão inválida é rejeitada", () => {
  assert.deepEqual(parseGlyphReference("3l0-glyph:v1:ABC_def-1234"), {
    scheme: "3l0-glyph",
    value: "ABC_def-1234",
    version: 1
  });
  assert.deepEqual(normalizeQrIdentifier("3l0-glyph:v1:ABC_def-1234"), {
    scheme: "3l0-glyph",
    value: "ABC_def-1234"
  });
  assert.throws(() => parseGlyphReference("3l0-glyph:v2:ABC_def-1234"), /invalid_or_unsupported_version/);
});

test("payload QR comum continua sendo tratado como QR genérico", () => {
  assert.equal(parseGlyphReference("https://example.test/item/123"), null);
  assert.deepEqual(normalizeQrIdentifier(" https://example.test/item/123 "), {
    scheme: "qr",
    value: "https://example.test/item/123"
  });
});
