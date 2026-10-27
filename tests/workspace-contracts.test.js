import test from "node:test";
import assert from "node:assert/strict";
import { createWorkspaceDraft, validateMembership, validateWorkspaceDraft } from "../core/workspaces/contracts.js";

const validInput = {
  organizationName: "Organização de demonstração",
  workspaceName: "Case 01 — ambiente de piloto",
  pilotObjective: "Avaliar conferência de recebimento",
  currentProcess: "Conferência manual de mercadorias e documentos",
  systems: ["Planilha"],
  successCriteria: ["Tempo por recebimento", "Quantidade de correções"]
};

test("validates a minimal workspace draft", () => {
  assert.deepEqual(validateWorkspaceDraft(validInput), { valid: true, errors: [] });
});

test("rejects missing objective and empty success criteria", () => {
  const result = validateWorkspaceDraft({ ...validInput, pilotObjective: " ", successCriteria: [] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("objetivo")));
  assert.ok(result.errors.some((error) => error.includes("critério de sucesso")));
});

test("creates a draft with declared, unverified provenance", () => {
  const workspace = createWorkspaceDraft(validInput, {
    id: "ws-demo-001",
    createdAt: "2026-10-27T10:00:00.000Z"
  });
  assert.equal(workspace.status, "draft");
  assert.equal(workspace.provenance.source, "user_declared");
  assert.equal(workspace.provenance.verificationStatus, "unverified");
  assert.equal(workspace.schemaVersion, "1.0");
  assert.equal(workspace.ownerUserId, null);
});

test("requires stable id and timestamp", () => {
  assert.throws(() => createWorkspaceDraft(validInput, { createdAt: "2026-10-27T10:00:00.000Z" }), /identificador/);
  assert.throws(() => createWorkspaceDraft(validInput, { id: "ws-1" }), /createdAt/);
});

test("validates membership role and scope", () => {
  assert.equal(validateMembership({
    workspaceId: "ws-1", userId: "user-1", role: "operator", status: "invited"
  }).valid, true);
  assert.equal(validateMembership({
    workspaceId: "ws-1", userId: "user-1", role: "platform_admin;operator", status: "active"
  }).valid, false);
});
