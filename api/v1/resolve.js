import { randomUUID } from "node:crypto";
import { ResolutionPipeline } from "../../core/pipeline/resolution-pipeline.js";
import { OrcClient } from "../../core/orc/client.js";
import { deterministicResolver } from "../../core/orc/deterministic-resolver.js";
import { normalizePersistedStatus } from "../../core/persistence/resolution-run.js";
import { handleError, methodNotAllowed, requireUser, sendJson } from "../_lib/supabase.js";

const MAX_CODE_LENGTH = 128;
const demoEntities = [{
  entity_id: "product_demo_001",
  type: "product",
  identifiers: [{ scheme: "ean", value: "789000000004" }],
  attributes: { name: "Produto X", unit: "500 ml" }
}];

function createDemoRepository() {
  return {
    async findCandidates({ observation }) {
      const identifiers = observation.identifiers || [];
      return demoEntities.filter(entity => entity.identifiers.some(candidate =>
        identifiers.some(observed =>
          candidate.scheme === observed.scheme &&
          String(candidate.value).trim() === String(observed.value).trim()
        )
      ));
    },
    async persistResolution() {
      // The durable operation record is written once the pipeline has returned,
      // so unresolved/conflicting outcomes are also retained for review.
      return { persisted: false, storage: "deferred-to-api" };
    }
  };
}

function parseBody(body) {
  if (body && typeof body === "object" && !Buffer.isBuffer(body)) return body;
  if (typeof body === "string") {
    try { return JSON.parse(body); } catch {
      const error = new Error("JSON inválido.");
      error.statusCode = 400;
      throw error;
    }
  }
  const error = new Error("Corpo JSON obrigatório.");
  error.statusCode = 400;
  throw error;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { client, user } = await requireUser(req);
    const body = parseBody(req.body);
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const workspaceId = typeof body.workspaceId === "string" ? body.workspaceId.trim() : "";
    if (!code || code.length > MAX_CODE_LENGTH) {
      return sendJson(res, 400, { error: "code_invalid", message: "Informe um identificador de até 128 caracteres." });
    }
    if (!workspaceId || workspaceId.length > 128) {
      return sendJson(res, 400, { error: "workspace_required", message: "Selecione um workspace autorizado." });
    }

    const { data: membership, error: membershipError } = await client
      .from("workspace_memberships")
      .select("workspace_id,role,status")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (!membership) {
      const error = new Error("Workspace não encontrado ou sem acesso.");
      error.statusCode = 403;
      throw error;
    }

    const scheme = typeof body.scheme === "string" && body.scheme.trim()
      ? body.scheme.trim().toLowerCase()
      : (/^\d{8}$|^\d{12,14}$/.test(code) ? "ean" : "identifier");
    const operation = body.operation === undefined ? "identify_product" : body.operation;
    if (!["identify_product", "receive_goods"].includes(operation)) {
      return sendJson(res, 400, { error: "operation_invalid", message: "Operação não suportada." });
    }
    const receivingInput = body.receiving && typeof body.receiving === "object" && !Array.isArray(body.receiving)
      ? body.receiving
      : null;
    const receivingDocumentLine = receivingInput?.document_line && typeof receivingInput.document_line === "object" && !Array.isArray(receivingInput.document_line)
      ? receivingInput.document_line
      : {};
    const receivingPhysicalObservation = receivingInput?.physical_observation && typeof receivingInput.physical_observation === "object" && !Array.isArray(receivingInput.physical_observation)
      ? receivingInput.physical_observation
      : {};
    const receivingIdentifiers = [receivingDocumentLine.gtin, receivingPhysicalObservation.barcode]
      .filter(value => typeof value === "string")
      .map(value => value.trim())
      .filter(Boolean);

    const pipeline = new ResolutionPipeline({
      captureAdapter: {
        async capture(input) {
          return {
            source: "api-manual-entry",
            modality: "identifier",
            identifiers: [{ scheme: input.scheme, value: input.code }],
            context: { capture_method: "api" }
          };
        }
      },
      entityRepository: createDemoRepository(),
      orcClient: new OrcClient({ resolver: deterministicResolver })
    });
    const output = await pipeline.run({
      input: { code, scheme, method: "api" },
      context: {
        operation,
        interface: "3l0-vision-api",
        request_id: randomUUID(),
        user_id: user.id,
        workspace_id: workspaceId,
        workspace_role: membership.role,
        ...(operation === "receive_goods" && receivingInput ? {
          receiving: {
            document_line: receivingDocumentLine,
            physical_observation: receivingPhysicalObservation,
            // Candidate identities come from the server-side catalog, never the request body.
            catalog_candidates: demoEntities.filter(entity =>
              entity.identifiers.some(identifier => receivingIdentifiers.includes(String(identifier.value).trim()))
            )
          }
        } : {})
      }
    });

    const resolutionId = output.result.resolution_id;
    const persistedStatus = normalizePersistedStatus(output.result.status);
    const { error: persistenceError } = await client.from("resolution_runs").insert({
      workspace_id: workspaceId,
      user_id: user.id,
      resolution_id: resolutionId,
      status: persistedStatus,
      state: output.state,
      input_scheme: scheme,
      input_code: code,
      observation: output.observation,
      result: output.result
    });
    if (persistenceError) throw persistenceError;

    return sendJson(res, 200, {
      apiVersion: "v1",
      resolutionId,
      status: output.result.status,
      state: output.state,
      observation: output.observation,
      result: output.result,
      persistence: { persisted: true, mode: "supabase-resolution-runs" },
      limitations: [
        "deterministic local matching only",
        "synthetic in-memory catalog",
        "no external ORC, OCR, model provider, or ERP/WMS integration"
      ]
    });
  } catch (error) {
    return handleError(res, error);
  }
}
