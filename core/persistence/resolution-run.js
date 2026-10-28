const PERSISTED_STATUSES = new Set([
  "RESOLVED",
  "UNCERTAIN",
  "INSUFFICIENT_EVIDENCE",
  "CONFLICT",
  "ERROR"
]);

const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const invalid = (message) => Object.assign(new Error(message), { statusCode: 400 });

export function normalizePersistedStatus(status) {
  if (status === "REVIEW_REQUIRED" || status === "REQUIRES_VERIFICATION" || status === "REJECTED_FOR_AUTOMATION") {
    return "UNCERTAIN";
  }
  if (status === "TECHNICAL_ERROR") return "ERROR";
  if (status === "INCOMPLETE" || status === "NOT_FOUND") return "INSUFFICIENT_EVIDENCE";
  if (PERSISTED_STATUSES.has(status)) return status;
  throw invalid("Unsupported resolution status: " + String(status));
}

export function validateResolutionPayload({ workspaceId, input, output }) {
  const isUuid = (value) => typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  if (!isUuid(workspaceId)) throw invalid("workspaceId inválido.");
  if (!isRecord(input)) throw invalid("Entrada da resolução inválida.");
  if (!isRecord(output)) throw invalid("Saída da resolução inválida.");

  const scheme = typeof input.scheme === "string" ? input.scheme.trim() : "";
  const code = typeof input.code === "string" ? input.code.trim() : "";
  const method = typeof input.method === "string" ? input.method.trim() : "";

  if (!scheme || scheme.length > 40) throw invalid("Esquema do identificador inválido.");
  if (!code || code.length > 128) throw invalid("Código do produto inválido.");
  if (!["manual", "barcode"].includes(method)) throw invalid("Método de entrada inválido.");
  if (!isRecord(output.observation) || !isRecord(output.result)) {
    throw invalid("Observação ou resultado de resolução inválido.");
  }
  if (typeof output.state !== "string" || !output.state.trim() || output.state.length > 120) {
    throw invalid("Estado da resolução inválido.");
  }

  const persistedStatus = normalizePersistedStatus(output.result.status);
  const candidateId = typeof output.result.resolutionId === "string"
    ? output.result.resolutionId.trim()
    : typeof output.result.resolution_id === "string"
      ? output.result.resolution_id.trim()
      : "";
  if (candidateId.length > 128) throw invalid("Identificador da resolução inválido.");

  return {
    scheme,
    code,
    method,
    state: output.state.trim(),
    persistedStatus,
    resolutionId: candidateId || null,
    observation: output.observation,
    result: output.result
  };
}
