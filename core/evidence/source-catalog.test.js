import test from "node:test";
import assert from "node:assert/strict";
import { CONTEXT_SOURCES, recommendContextSources } from "./source-catalog.js";

test("catalog exposes supported and planned context source types", () => {
  const ids = CONTEXT_SOURCES.map((source) => source.id);
  assert.ok(ids.includes("invoice_xml"));
  assert.ok(ids.includes("document_image"));
  assert.ok(ids.includes("erp_catalog"));
  assert.ok(ids.includes("business_registry"));
});

test("recommends XML first for missing invoice line items", () => {
  const recommendations = recommendContextSources({ missingFields: ["line_items", "quantities"] });
  assert.equal(recommendations[0].sourceId, "invoice_xml");
  assert.ok(recommendations[0].matchedFields.includes("line_items"));
});

test("does not recommend a source the user already supplied", () => {
  const recommendations = recommendContextSources({
    missingFields: ["line_items"],
    availableSources: ["invoice_xml"]
  });
  assert.ok(!recommendations.some((item) => item.sourceId === "invoice_xml"));
});

test("recommendations disclose requirements and implementation status", () => {
  const recommendations = recommendContextSources({ missingFields: ["issuer_registration_data"] });
  const registry = recommendations.find((item) => item.sourceId === "business_registry");
  assert.ok(registry);
  assert.ok(registry.requirements.includes("access_policy_check"));
  assert.equal(registry.status, "planned");
});

test("unknown fields produce no invented recommendation", () => {
  assert.deepEqual(recommendContextSources({ missingFields: ["unknown_private_field"] }), []);
});
