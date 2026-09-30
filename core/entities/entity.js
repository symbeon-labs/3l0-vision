export function createEntity(input = {}) {
  const {
    entityId,
    type = "unknown",
    identifiers = [],
    attributes = {},
    relations = [],
    metadata = {}
  } = input;

  if (!entityId) throw new Error("entityId is required");

  return {
    entity_id: String(entityId),
    type,
    identifiers: identifiers.map(normalizeIdentifier),
    attributes: { ...attributes },
    relations: [...relations],
    metadata: { ...metadata }
  };
}

function normalizeIdentifier(identifier = {}) {
  if (!identifier.scheme || identifier.value === undefined) {
    throw new Error("identifier scheme and value are required");
  }

  return {
    scheme: String(identifier.scheme),
    value: String(identifier.value).trim()
  };
}
