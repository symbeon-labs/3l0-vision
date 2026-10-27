import { handleError, methodNotAllowed, requireUser, sendJson } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") return methodNotAllowed(res, ["GET", "POST"]);
  try {
    const { client, user } = await requireUser(req);

    if (req.method === "GET") {
      const { data, error } = await client
        .from("workspace_memberships")
        .select("role,status,workspace:workspaces(id,organization_id,name,objective,status,created_at,organization:organizations(id,name))")
        .eq("user_id", user.id)
        .eq("status", "active");
      if (error) throw error;
      return sendJson(res, 200, { workspaces: (data || []).filter((row) => row.workspace).map((row) => ({ ...row.workspace, role: row.role })) });
    }

    const body = req.body && typeof req.body === "object" ? req.body : {};
    const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : "";
    const input = {
      organizationName: clean(body.organizationName, 120),
      workspaceName: clean(body.workspaceName, 120),
      pilotObjective: clean(body.pilotObjective, 240),
      currentProcess: clean(body.currentProcess, 1200),
      systems: Array.isArray(body.systems) ? body.systems.filter((x) => typeof x === "string").map((x) => x.trim().slice(0, 120)).filter(Boolean).slice(0, 30) : [],
      successCriteria: Array.isArray(body.successCriteria) ? body.successCriteria.filter((x) => typeof x === "string").map((x) => x.trim().slice(0, 200)).filter(Boolean).slice(0, 30) : []
    };
    if (!input.organizationName || !input.workspaceName || !input.pilotObjective || !input.currentProcess || !input.successCriteria.length) {
      return sendJson(res, 400, { error: "Preencha organização, workspace, objetivo, processo atual e ao menos um critério de sucesso." });
    }
    const { data, error } = await client.rpc("create_workspace_with_org", {
      p_organization_name: input.organizationName,
      p_workspace_name: input.workspaceName,
      p_objective: input.pilotObjective,
      p_current_process: input.currentProcess,
      p_systems: input.systems,
      p_success_criteria: input.successCriteria
    });
    if (error) throw error;
    return sendJson(res, 201, { workspace: data, notice: "Workspace criado como rascunho. A ativação operacional é uma etapa separada." });
  } catch (error) {
    return handleError(res, error);
  }
}
