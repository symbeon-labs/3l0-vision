export function createObservation(input = {}) {
  const {
    observationId,
    observedAt,
    source,
    modality,
    identifiers = [],
    text = [],
    attributes = {},
    metadata = {},
    evidence = []
  } = input;

  if (!observationId) throw new Error("observationId is required");
  if (!observedAt) throw new Error("observedAt is required");
  if (!source) throw new Error("source is required");
  if (!modality) throw new Error("modality is required");

  return {
    observation_id: String(observationId),
    observed_at: observedAt,
    source,
    modality,
    identifiers: identifiers.map(normalizeIdentifier),
    text: [...text],
    attributes: { ...attributes },
    metadata: { ...metadata },
    evidence: [...evidence]
  };
}

function normalizeIdentifier(identifier = {}) {
  if (!identifier.scheme || identifier.value === undefined) {
    throw new Error("identifier scheme and value are required");
  }

  return {
    scheme: String(identifier.scheme),
    value: String(identifier.value).trim(),
    confidence: identifier.confidence ?? null
  };
}
