import { handleError, methodNotAllowed, requireUser, sendJson } from "./_lib/supabase.js";
import { normalizePersistedStatus } from "../core/persistence/resolution-run.js";

const isUuid = (value) => typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return methodNotAllowed(res, ["GET", "POST"]);

  try {
    const { client, user } = await requireUser(req);

    if (req.method === "GET") {
      const workspaceId = typeof req.query?.workspaceId === "string" ? req.query.workspaceId : "";
      if (!isUuid(workspaceId)) return sendJson(res, 400, { error: "workspaceId inválido." });
      const { data: membership, error: membershipError } = await client
        .from("workspace_memberships")
        .select("workspace_id")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      if (membershipError) throw membershipError;
      if (!membership) return sendJson(res, 403, { error: "Você não tem acesso ativo a este workspace." });

      const { data, error } = await client
        .from("resolution_runs")
        .select("id,workspace_id,resolution_id,status,state,input_scheme,input_code,observation,result,created_at")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return sendJson(res, 200, { runs: data || [] });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const workspaceId = body.workspaceId;
    const input = body.input && typeof body.input === "object" ? body.input : {};
    const output = body.output && typeof body.output === "object" ? body.output : {};
    const scheme = typeof input.scheme === "string" ? input.scheme.trim() : "";
    const code = typeof input.code === "string" ? input.code.trim() : "";
    const method = typeof input.method === "string" ? input.method.trim() : "";

    if (!isUuid(workspaceId)) return sendJson(res, 400, { error: "workspaceId inválido." });
    if (!scheme || scheme.length > 40) return sendJson(res, 400, { error: "Esquema do identificador inválido." });
    if (!code || code.length > 128) return sendJson(res, 400, { error: "Código do produto inválido." });
    if (!["manual", "barcode"].includes(method)) return sendJson(res, 400, { error: "Método de entrada inválido." });
    if (!output.observation || typeof output.observation !== "object" ||
        !output.result || typeof output.result !== "object" ||
        !output.state || typeof output.state !== "string") {
      return sendJson(res, 400, { error: "Saída de resolução incompleta." });
    }

    // Explicit membership check keeps the workspace boundary clear even if
    // database policies change. The insert is still enforced by RLS.
    const { data: membership, error: membershipError } = await client
      .from("workspace_memberships")
      .select("workspace_id,role,status")
      .eq("workspace_id", workspaceId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (!membership) return sendJson(res, 403, { error: "Você não tem acesso ativo a este workspace." });

    const result = output.result;
    const persistedStatus = normalizePersistedStatus(result.status);
    const resolutionId = typeof result.resolutionId === "string" && result.resolutionId.length <= 128
      ? result.resolutionId
      : typeof result.resolution_id === "string" && result.resolution_id.length <= 128
        ? result.resolution_id
        : "res_" + crypto.randomUUID();

    const record = {
      workspace_id: workspaceId,
      user_id: user.id,
      resolution_id: resolutionId,
      status: persistedStatus,
      state: { value: output.state },
      input_scheme: scheme,
      input_code: code,
      observation: output.observation,
      result
    };

    const { data, error } = await client
      .from("resolution_runs")
      .insert(record)
      .select("id,workspace_id,resolution_id,status,created_at")
      .single();
    if (error) throw error;

    return sendJson(res, 201, { run: data });
  } catch (error) {
    return handleError(res, error);
  }
}
