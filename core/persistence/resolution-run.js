const PERSISTED_STATUSES = new Set([
  "RESOLVED",
  "UNCERTAIN",
  "INSUFFICIENT_EVIDENCE",
  "CONFLICT",
  "ERROR"
]);

export function normalizePersistedStatus(status) {
  if (status === "REVIEW_REQUIRED" || status === "REQUIRES_VERIFICATION" || status === "REJECTED_FOR_AUTOMATION") {
    return "UNCERTAIN";
  }
  if (status === "TECHNICAL_ERROR") return "ERROR";
  if (status === "INCOMPLETE" || status === "NOT_FOUND") return "INSUFFICIENT_EVIDENCE";
  if (PERSISTED_STATUSES.has(status)) return status;
  throw new Error("Unsupported resolution status: " + String(status));
}
