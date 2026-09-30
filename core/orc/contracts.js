export const RESOLUTION_STATUSES = Object.freeze([
  "RESOLVED",
  "CONFLICT",
  "UNCERTAIN",
  "INCOMPLETE",
  "REQUIRES_VERIFICATION"
]);

export const TECHNICAL_ERRORS = Object.freeze([
  "TIMEOUT",
  "UNAVAILABLE",
  "INVALID_REQUEST",
  "DEPENDENCY_ERROR"
]);

export function createResolutionRequest(input = {}) {
  const {
    resolutionId,
    question,
    entities = [],
    relations = [],
    assertions = [],
    evidence = [],
    observations = [],
    context = {},
    ruleset = { id: "default", version: "0.1" }
  } = input;

  if (!resolutionId) throw new Error("resolutionId is required");
  if (!question) throw new Error("question is required");

  return {
    resolution_id: String(resolutionId),
    question,
    entities: [...entities],
    relations: [...relations],
    assertions: [...assertions],
    evidence: [...evidence],
    observations: [...observations],
    context: { ...context },
    ruleset: { ...ruleset }
  };
}

export function createResolutionResult(input = {}) {
  const {
    resolutionId,
    status,
    entities = [],
    resolvedAttributes = {},
    conflicts = [],
    uncertainties = [],
    requiresVerification = [],
    provenance = [],
    resolutionMetadata = {}
  } = input;

  if (!resolutionId) throw new Error("resolutionId is required");
  if (!RESOLUTION_STATUSES.includes(status)) {
    throw new Error("invalid resolution status");
  }

  return {
    resolution_id: String(resolutionId),
    status,
    entities: [...entities],
    resolved_attributes: { ...resolvedAttributes },
    conflicts: [...conflicts],
    uncertainties: [...uncertainties],
    requires_verification: [...requiresVerification],
    provenance: [...provenance],
    resolution_metadata: { ...resolutionMetadata }
  };
}
