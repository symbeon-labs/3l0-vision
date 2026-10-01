export const PRODUCT_STATES = Object.freeze([
  "CAPTURING",
  "PROCESSING",
  "RESOLVED",
  "ATTENTION",
  "CONFLICT",
  "UNCERTAIN"
]);

const STATUS_TO_PRODUCT_STATE = Object.freeze({
  RESOLVED: "RESOLVED",
  CONFLICT: "CONFLICT",
  UNCERTAIN: "UNCERTAIN",
  INCOMPLETE: "ATTENTION",
  REQUIRES_VERIFICATION: "ATTENTION",
  REJECTED_FOR_AUTOMATION: "ATTENTION"
});

export function mapResolutionToProductState(status) {
  const state = STATUS_TO_PRODUCT_STATE[status];

  if (!state) {
    throw new Error(`unsupported resolution status: ${status}`);
  }

  return state;
}
