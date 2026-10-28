const PERSISTED_STATUSES = new Set([
  "RESOLVED",
  "UNCERTAIN",
  "INSUFFICIENT_EVIDENCE",
  "CONFLICT",
  "ERROR"
]);

export function normalizePersistedStatus(status) {
  if (status === "REVIEW_REQUIRED") return "UNCERTAIN";
  if (status === "TECHNICAL_ERROR") return "ERROR";
  if (PERSISTED_STATUSES.has(status)) return status;
  throw new Error("Unsupported resolution status: " + String(status));
}
