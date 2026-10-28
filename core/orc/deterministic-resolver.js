import { createResolutionResult } from "./contracts.js";

export function deterministicResolver(request) {
  const receivingRequired = request.context?.operation === "receive_goods" ||
    request.context?.workflow === "receiving";
  if (receivingRequired && !request.context?.receiving) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{ type: "missing_receiving_context" }]
    });
  }

  const guarded = evaluateReceivingConsistency(request);
  if (guarded) return guarded;

  const identifiers = request.observations.flatMap(
    (observation) => observation.identifiers ?? []
  );
  const matches = [];

  for (const entity of request.entities) {
    for (const observed of identifiers) {
      const matched = entity.identifiers?.find(
        (identifier) =>
          identifier.scheme === observed.scheme &&
          identifier.value === observed.value
      );
      if (matched) matches.push(entity);
    }
  }

  const unique = [
    ...new Map(matches.map((entity) => [entity.entity_id, entity])).values()
  ];

  if (unique.length === 1) {
    return createResolutionResult({
      resolutionId: request.resolution_id,
      status: "RESOLVED",
      entities: [unique[0].entity_id],
      provenance: ["deterministic-identifier-match"],
      resolutionMetadata: { strategy: "deterministic", version: "0.2" }
    });
  }

  if (unique.length > 1) {
    return createResolutionResult({
      resolutionId: request.resolution_id,
      status: "CONFLICT",
      conflicts: [{ type: "multiple_entity_matches", candidates: unique.map((e) => e.entity_id) }],
      resolutionMetadata: { strategy: "deterministic", version: "0.2" }
    });
  }

  return createResolutionResult({
    resolutionId: request.resolution_id,
    status: "UNCERTAIN",
    uncertainties: [{ type: "no_deterministic_match" }],
    resolutionMetadata: { strategy: "deterministic", version: "0.2" }
  });
}

function evaluateReceivingConsistency(request) {
  const receiving = request.context?.receiving;
  if (!receiving) return null;

  const {
    document_line: documentLine = {},
    physical_observation: physical = {},
    catalog_candidates: candidates = []
  } = receiving;

  if (physical.capture_status === "FAILED") {
    return receivingResult(request, "TECHNICAL_ERROR", {
      uncertainties: [{ type: "technical_input_failure", code: physical.error_code ?? "UNKNOWN" }]
    });
  }

  const declaredGtin = normalize(documentLine.gtin);
  const observedBarcode = normalize(physical.barcode);
  const capturedIdentifiers = request.observations.flatMap(
    (observation) => observation.identifiers ?? []
  ).map((identifier) => normalize(identifier.value)).filter(Boolean);

  if (!declaredGtin) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{ type: "document_identifier_missing" }]
    });
  }

  if (!observedBarcode) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{
        type: "physical_identifier_missing",
        declared: declaredGtin,
        ocr_confidence: physical.ocr_confidence ?? null
      }]
    });
  }

  if (declaredGtin !== observedBarcode) {
    return receivingResult(request, "CONFLICT", {
      conflicts: [{ type: "document_physical_identifier_mismatch" }]
    });
  }

  if (capturedIdentifiers.length > 0 && !capturedIdentifiers.includes(observedBarcode)) {
    return receivingResult(request, "CONFLICT", {
      conflicts: [{ type: "capture_context_identifier_mismatch", observed: observedBarcode }]
    });
  }

  if (!Number.isFinite(documentLine.quantity) || !Number.isFinite(physical.quantity_observed)) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{ type: "quantity_evidence_missing" }]
    });
  }

  if (documentLine.quantity !== physical.quantity_observed) {
    return receivingResult(request, "CONFLICT", {
      conflicts: [{ type: "quantity_mismatch", declared: documentLine.quantity, observed: physical.quantity_observed }]
    });
  }

  const declaredUnit = normalize(documentLine.unit);
  const observedUnit = normalize(physical.unit_observed);
  if (!declaredUnit || !observedUnit) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{ type: "unit_evidence_missing", declared: declaredUnit || null, observed: observedUnit || null }]
    });
  }
  if (declaredUnit !== observedUnit) {
    return receivingResult(request, "REVIEW_REQUIRED", {
      requiresVerification: [{ type: "unit_mismatch", declared: declaredUnit, observed: observedUnit }]
    });
  }

  const declaredPack = extractPack(documentLine.description);
  const observedPack = extractPack(physical.visible_text);
  if (declaredPack && observedPack &&
      declaredPack.unit === observedPack.unit &&
      declaredPack.amount !== observedPack.amount) {
    return receivingResult(request, "CONFLICT", {
      conflicts: [{ type: "pack_description_mismatch", declared: declaredPack, observed: observedPack }]
    });
  }

  if (candidates.length === 0) {
    return receivingResult(request, "NOT_FOUND", {
      uncertainties: [{ type: "catalog_item_not_found" }]
    });
  }

  return null;
}

function receivingResult(request, status, details = {}) {
  return createResolutionResult({
    resolutionId: request.resolution_id,
    status,
    entities: [],
    conflicts: details.conflicts ?? [],
    uncertainties: details.uncertainties ?? [],
    requiresVerification: details.requiresVerification ?? [],
    provenance: ["receiving-consistency-gate"],
    resolutionMetadata: { strategy: "deterministic", version: "0.2" }
  });
}

function normalize(value) {
  return value == null ? "" : String(value).trim().toUpperCase();
}

function extractPack(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+(?:[.,]\d+)?)\s*(ML|L|KG|G)\b/i);
  if (!match) return null;

  const unit = match[2].toUpperCase();
  let amount = Number(match[1].replace(",", "."));
  if (unit === "ML") amount /= 1000;
  if (unit === "G") amount /= 1000;
  return {
    amount,
    unit: unit === "ML" ? "L" : unit === "G" ? "KG" : unit
  };
}
