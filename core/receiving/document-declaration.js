import { createObservation } from "../observations/observation.js";

/**
 * Converts a document item already extracted by a trusted XML/document adapter
 * into an observation. Raw XML parsing is deliberately a separate adapter.
 * Values are preserved as declared; this function does not assert physical truth.
 */
export function createDocumentItemObservation({
  observationId,
  observedAt,
  sourceRef,
  documentType = "nfe",
  issuerId = null,
  documentNumber = null,
  item = {},
  context = {}
} = {}) {
  if (!sourceRef) throw new Error("sourceRef is required");
  if (!item.code && !item.description) {
    throw new Error("document item requires a declared code or description");
  }

  const identifiers = [];
  if (item.code) identifiers.push({ scheme: "document-item-code", value: String(item.code) });
  if (item.gtin) identifiers.push({ scheme: "gtin", value: String(item.gtin) });

  const attributes = {};
  for (const key of ["description", "commercialUnit", "quantity", "unitPrice", "totalValue", "ncm"]) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      attributes[key] = item[key];
    }
  }

  return createObservation({
    observationId,
    observedAt,
    source: "fiscal-document",
    modality: "structured-document",
    identifiers,
    text: item.description ? [String(item.description)] : [],
    attributes,
    metadata: {
      document_type: documentType,
      document_number: documentNumber,
      issuer_id: issuerId,
      source_ref: sourceRef,
      extraction_status: "adapter-provided",
      declared_values_only: true
    },
    evidence: [{ type: "document-item", reference: sourceRef }],
    context: { ...context, claim_scope: "document-declaration" }
  });
}
