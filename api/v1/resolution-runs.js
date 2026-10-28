import { handleError, methodNotAllowed, requireUser, sendJson } from "../_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);
  try {
    const { client, user } = await requireUser(req);
    const workspaceId = typeof req.query?.workspaceId === "string" ? req.query.workspaceId.trim() : "";
    const requestedLimit = Number.parseInt(req.query?.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;

    if (!workspaceId || workspaceId.length > 128) {
      return sendJson(res, 400, { error: "workspace_required", message: "Informe um workspace autorizado." });
    }

    const { data: membership, error: membershipError } = await client
      .from("workspace_memberships")
      .select("workspace_id")
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

    const { data, error } = await client
      .from("resolution_runs")
      .select("id,workspace_id,user_id,resolution_id,status,state,input_scheme,input_code,observation,result,created_at")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;

    return sendJson(res, 200, {
      apiVersion: "v1",
      workspaceId,
      count: data?.length ?? 0,
      runs: data ?? []
    });
  } catch (error) {
    return handleError(res, error);
  }
}
