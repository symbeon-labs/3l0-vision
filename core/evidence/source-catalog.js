/**
 * Extensible catalog of context sources for Case 01.
 *
 * This catalog describes capabilities and prerequisites; it does not claim that
 * OCR, fiscal lookups, or external integrations are operational.
 */
export const CONTEXT_SOURCES = Object.freeze([
  {
    id: "invoice_xml",
    label: "XML fiscal",
    formats: ["application/xml", "text/xml", ".xml"],
    capabilities: ["issuer", "recipient", "document_number", "issue_date", "line_items", "quantities", "values", "fiscal_codes"],
    requirements: ["user_supplied_file"],
    status: "input_supported_by_catalog_only"
  },
  {
    id: "invoice_pdf",
    label: "PDF da nota/DANFE/DANFSe",
    formats: ["application/pdf", ".pdf"],
    capabilities: ["issuer", "document_number", "issue_date", "line_items", "quantities", "values"],
    requirements: ["document_parser_or_ocr"],
    status: "planned"
  },
  {
    id: "document_image",
    label: "Foto ou imagem do documento",
    formats: ["image/jpeg", "image/png", "image/webp"],
    capabilities: ["visible_text", "line_items", "codes_if_legible"],
    requirements: ["image_capture_or_upload", "ocr_for_text_extraction"],
    status: "camera_capture_in_case01_branch"
  },
  {
    id: "qr_or_access_key",
    label: "QR Code ou chave de acesso",
    formats: ["qr_code", "access_key"],
    capabilities: ["document_reference", "possible_official_lookup"],
    requirements: ["document_type_detection", "authorized_lookup_when_available"],
    status: "partial_qr_syntax_support_only"
  },
  {
    id: "product_barcode",
    label: "Código de barras do produto",
    formats: ["ean_13", "ean_8", "code_128", "gtin"],
    capabilities: ["product_identifier"],
    requirements: ["browser_barcode_support_or_manual_entry", "catalog_for_product_resolution"],
    status: "existing_partial_support"
  },
  {
    id: "erp_catalog",
    label: "Catálogo ou exportação do ERP",
    formats: ["text/csv", ".csv", ".xlsx", "application/json", ".json"],
    capabilities: ["sku", "description", "unit", "internal_product_id", "stock_reference"],
    requirements: ["import_adapter_or_authorized_api"],
    status: "planned"
  },
  {
    id: "business_registry",
    label: "Cadastro empresarial",
    formats: ["cnpj", "official_registry_response"],
    capabilities: ["issuer_registration_data"],
    requirements: ["permitted_data_source", "access_policy_check"],
    status: "planned"
  },
  {
    id: "physical_product",
    label: "Mercadoria física",
    formats: ["camera_observation", "manual_observation"],
    capabilities: ["visible_packaging", "product_barcode", "human_observation"],
    requirements: ["camera_or_manual_input"],
    status: "partial_camera_and_barcode_support"
  }
]);

const FIELD_SOURCE_PRIORITY = Object.freeze({
  line_items: ["invoice_xml", "invoice_pdf", "document_image", "erp_catalog"],
  quantities: ["invoice_xml", "invoice_pdf", "document_image", "erp_catalog"],
  values: ["invoice_xml", "invoice_pdf", "document_image"],
  issuer: ["invoice_xml", "invoice_pdf", "document_image", "business_registry"],
  issuer_registration_data: ["business_registry", "invoice_xml", "invoice_pdf"],
  product_identifier: ["product_barcode", "invoice_xml", "invoice_pdf", "document_image", "physical_product"],
  sku: ["erp_catalog", "invoice_xml", "invoice_pdf", "document_image"],
  description: ["invoice_xml", "erp_catalog", "invoice_pdf", "document_image", "physical_product"],
  document_reference: ["qr_or_access_key", "invoice_xml", "invoice_pdf", "document_image"]
});

/**
 * Recommend the next source for missing fields, excluding sources already
 * supplied. Recommendations are deterministic and never imply external access.
 */
export function recommendContextSources({ missingFields = [], availableSources = [] } = {}) {
  const available = new Set(availableSources);
  const scores = new Map();

  for (const field of missingFields) {
    const priorities = FIELD_SOURCE_PRIORITY[field] ?? [];
    priorities.forEach((sourceId, index) => {
      if (available.has(sourceId)) return;
      const current = scores.get(sourceId) ?? { sourceId, matchedFields: [], score: 0 };
      if (!current.matchedFields.includes(field)) current.matchedFields.push(field);
      current.score += priorities.length - index;
      scores.set(sourceId, current);
    });
  }

  return [...scores.values()]
    .map((item) => ({
      ...item,
      source: CONTEXT_SOURCES.find((source) => source.id === item.sourceId)
    }))
    .sort((a, b) => b.score - a.score || a.sourceId.localeCompare(b.sourceId))
    .map(({ sourceId, matchedFields, score, source }) => ({
      sourceId,
      label: source.label,
      matchedFields,
      score,
      formats: source.formats,
      requirements: source.requirements,
      status: source.status
    }));
}
