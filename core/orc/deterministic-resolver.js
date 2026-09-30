import { createResolutionResult } from "./contracts.js";

export function deterministicResolver(request) {
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
      resolutionMetadata: { strategy: "deterministic", version: "0.1" }
    });
  }

  if (unique.length > 1) {
    return createResolutionResult({
      resolutionId: request.resolution_id,
      status: "CONFLICT",
      conflicts: [{ type: "multiple_entity_matches", candidates: unique.map((e) => e.entity_id) }],
      resolutionMetadata: { strategy: "deterministic", version: "0.1" }
    });
  }

  return createResolutionResult({
    resolutionId: request.resolution_id,
    status: "UNCERTAIN",
    uncertainties: [{ type: "no_deterministic_match" }],
    resolutionMetadata: { strategy: "deterministic", version: "0.1" }
  });
}
