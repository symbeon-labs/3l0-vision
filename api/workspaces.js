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

    // Workspace creation is restricted to the contract/invitation workflow.
    // Do not let any authenticated account self-provision an operational scope.
    return sendJson(res, 403, {
      error: "invitation_required",
      message: "A criação de workspace exige convite e escopo de piloto previamente autorizado."
    });
  } catch (error) {
    return handleError(res, error);
  }
}
