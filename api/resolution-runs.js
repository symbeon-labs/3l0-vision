import { handleError, methodNotAllowed, requireUser, sendJson } from "./_lib/supabase.js";
import { validateResolutionPayload } from "../core/persistence/resolution-run.js";

const isUuid = (value) => typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") return methodNotAllowed(res, ["GET", "POST"]);
  if (req.method === "POST") {
    return sendJson(res, 410, {
      error: "client_supplied_results_not_accepted",
      message: "O registro de resultados enviados pelo cliente foi desativado. Use POST /api/v1/resolve para calcular e persistir a resolução no servidor."
    });
  }

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

    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const payload = validateResolutionPayload({
      workspaceId: body.workspaceId,
      input: body.input,
      output: body.output
    });

    const { data: membership, error: membershipError } = await client
      .from("workspace_memberships")
      .select("workspace_id,role,status")
      .eq("workspace_id", body.workspaceId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (!membership) return sendJson(res, 403, { error: "Você não tem acesso ativo a este workspace." });

    const record = {
      workspace_id: body.workspaceId,
      user_id: user.id,
      resolution_id: payload.resolutionId || "res_" + crypto.randomUUID(),
      status: payload.persistedStatus,
      state: { value: payload.state },
      input_scheme: payload.scheme,
      input_code: payload.code,
      observation: payload.observation,
      result: payload.result
    };

    const { data, error } = await client
      .from("resolution_runs")
      .insert(record)
      .select("id,workspace_id,resolution_id,status,created_at")
      .single();
    if (error) {
      if (error.code === "23505") {
        return sendJson(res, 409, { error: "Esta resolução já foi registrada neste workspace." });
      }
      throw error;
    }

    return sendJson(res, 201, { run: data });
  } catch (error) {
    return handleError(res, error);
  }
}
