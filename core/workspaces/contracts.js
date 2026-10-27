export const WORKSPACE_ROLES = Object.freeze([
  "platform_admin",
  "workspace_owner",
  "operator",
  "reviewer",
  "read_only"
]);

export const WORKSPACE_STATUSES = Object.freeze(["draft", "active", "suspended"]);
export const MEMBERSHIP_STATUSES = Object.freeze(["invited", "active", "suspended", "revoked"]);

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

/**
 * Validates the minimum workspace activation contract.
 * This is domain validation only; it does not authenticate users or authorize access.
 */
export function validateWorkspaceDraft(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: ["Workspace deve ser um objeto."] };
  }

  if (!isNonEmptyString(input.organizationName)) errors.push("Informe o nome da organização.");
  if (!isNonEmptyString(input.workspaceName)) errors.push("Informe o nome do workspace.");
  if (!isNonEmptyString(input.pilotObjective)) errors.push("Informe o objetivo operacional do piloto.");
  if (!isNonEmptyString(input.currentProcess)) errors.push("Descreva resumidamente o processo atual.");
  if (!Array.isArray(input.systems) || input.systems.some((item) => !isNonEmptyString(item))) {
    errors.push("Sistemas deve ser uma lista de nomes válidos.");
  }
  if (!Array.isArray(input.successCriteria) || input.successCriteria.length === 0 ||
      input.successCriteria.some((item) => !isNonEmptyString(item))) {
    errors.push("Defina ao menos um critério de sucesso.");
  }
  if (input.status !== undefined && !WORKSPACE_STATUSES.includes(input.status)) {
    errors.push("Estado de workspace inválido.");
  }

  return { valid: errors.length === 0, errors };
}

export function createWorkspaceDraft(input, { id, createdAt, ownerUserId = null } = {}) {
  const validation = validateWorkspaceDraft(input);
  if (!validation.valid) {
    const error = new Error("Workspace inválido.");
    error.name = "WorkspaceValidationError";
    error.errors = validation.errors;
    throw error;
  }

  if (!isNonEmptyString(id)) throw new TypeError("É necessário fornecer um identificador estável.");
  if (!isNonEmptyString(createdAt)) throw new TypeError("É necessário fornecer createdAt em formato ISO-8601.");

  return Object.freeze({
    schemaVersion: "1.0",
    id,
    organizationName: input.organizationName.trim(),
    workspaceName: input.workspaceName.trim(),
    pilotObjective: input.pilotObjective.trim(),
    currentProcess: input.currentProcess.trim(),
    systems: [...new Set(input.systems.map((item) => item.trim()))],
    successCriteria: [...new Set(input.successCriteria.map((item) => item.trim()))],
    status: "draft",
    ownerUserId,
    provenance: {
      source: "user_declared",
      verificationStatus: "unverified",
      capturedAt: createdAt
    },
    createdAt,
    updatedAt: createdAt
  });
}

export function validateMembership(input) {
  const errors = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { valid: false, errors: ["Membership deve ser um objeto."] };
  }
  if (!isNonEmptyString(input.workspaceId)) errors.push("Membership precisa de workspaceId.");
  if (!isNonEmptyString(input.userId)) errors.push("Membership precisa de userId.");
  if (!WORKSPACE_ROLES.includes(input.role)) errors.push("Papel de workspace inválido.");
  if (!MEMBERSHIP_STATUSES.includes(input.status)) errors.push("Estado de membership inválido.");
  return { valid: errors.length === 0, errors };
}
