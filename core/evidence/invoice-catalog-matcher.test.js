import test from "node:test";
import assert from "node:assert/strict";
import { matchInvoiceItemsToCatalog } from "./invoice-catalog-matcher.js";

function catalogWith(items) {
  return {
    async findCandidates({ observation }) {
      const gtin = observation.identifiers[0]?.value;
      return items[gtin] ?? [];
    }
  };
}

const invoice = {
  documentType: "NFE_XML",
  items: [
    { lineNumber: 1, description: "Produto demonstrativo", gtin: "789000000004" },
    { lineNumber: 2, description: "Item sem GTIN", gtin: null },
    { lineNumber: 3, description: "Item não cadastrado", gtin: "789111111111" },
    { lineNumber: 4, description: "Item com conflito", gtin: "789222222222" }
  ]
};

test("matches only by GTIN against catalog identifiers and preserves review states", async () => {
  const result = await matchInvoiceItemsToCatalog(invoice, catalogWith({
    "789000000004": [{ entity_id: "product_demo_001", attributes: { name: "Produto X" } }],
    "789222222222": [
      { entity_id: "product_a", attributes: { name: "A" } },
      { entity_id: "product_b", attributes: { name: "B" } }
    ]
  }));

  assert.deepEqual(result.counts, { total: 4, candidates: 1, needsReview: 2, conflicts: 1 });
  assert.equal(result.items[0].status, "MATCH_CANDIDATE");
  assert.equal(result.items[0].candidates[0].entityId, "product_demo_001");
  assert.equal(result.items[1].reason, "missing_gtin");
  assert.equal(result.items[2].status, "NEEDS_REVIEW");
  assert.equal(result.items[3].status, "CONFLICT");
  assert.equal(result.validation, "identifier_match_only_not_fiscal_or_physical_validation");
});

test("rejects missing invoice or catalog adapter", async () => {
  await assert.rejects(() => matchInvoiceItemsToCatalog(null, catalogWith({})), /invoice_items_required/);
  await assert.rejects(() => matchInvoiceItemsToCatalog(invoice, {}), /catalog_adapter_required/);
});

test("does not match placeholders as GTIN", async () => {
  const result = await matchInvoiceItemsToCatalog({
    items: [{ description: "Placeholder", gtin: "SEM GTIN" }]
  }, catalogWith({}));
  assert.equal(result.items[0].status, "NEEDS_REVIEW");
  assert.equal(result.items[0].reason, "missing_gtin");
});
