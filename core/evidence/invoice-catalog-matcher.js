/**
 * Compare fiscal invoice lines against an authorized/local product catalog.
 * This is identifier matching only; it is not fiscal validation or proof that
 * the physical item matches the invoice.
 */
export async function matchInvoiceItemsToCatalog(invoice, catalog) {
  if (!invoice || !Array.isArray(invoice.items)) throw new Error("invoice_items_required");
  if (!catalog || typeof catalog.findCandidates !== "function") throw new Error("catalog_adapter_required");

  const results = [];
  for (const item of invoice.items) {
    const identifier = item.gtin && !/^SEM GTIN$/i.test(item.gtin.trim())
      ? { scheme: "ean", value: item.gtin.trim() }
      : null;

    if (!identifier) {
      results.push({
        lineNumber: item.lineNumber ?? null,
        description: item.description ?? item.code ?? "Item sem descrição",
        status: "NEEDS_REVIEW",
        reason: "missing_gtin",
        candidates: []
      });
      continue;
    }

    const candidates = await catalog.findCandidates({
      observation: {
        identifiers: [identifier],
        attributes: {},
        metadata: { source: "user_supplied_xml", validation: "parsed_only_not_fiscally_validated" }
      }
    });

    results.push({
      lineNumber: item.lineNumber ?? null,
      description: item.description ?? item.code ?? "Item sem descrição",
      gtin: identifier.value,
      status: candidates.length === 1 ? "MATCH_CANDIDATE" : candidates.length > 1 ? "CONFLICT" : "NEEDS_REVIEW",
      reason: candidates.length === 1 ? "unique_catalog_identifier_match" : candidates.length > 1 ? "multiple_catalog_candidates" : "no_catalog_match",
      candidates: candidates.map((candidate) => ({
        entityId: candidate.entity_id ?? candidate.entityId ?? null,
        name: candidate.attributes?.name ?? candidate.name ?? null
      }))
    });
  }

  return {
    documentType: invoice.documentType ?? "UNKNOWN",
    source: "user_supplied_xml",
    validation: "identifier_match_only_not_fiscal_or_physical_validation",
    matchedAt: new Date().toISOString(),
    counts: {
      total: results.length,
      candidates: results.filter((item) => item.status === "MATCH_CANDIDATE").length,
      needsReview: results.filter((item) => item.status === "NEEDS_REVIEW").length,
      conflicts: results.filter((item) => item.status === "CONFLICT").length
    },
    items: results
  };
}
