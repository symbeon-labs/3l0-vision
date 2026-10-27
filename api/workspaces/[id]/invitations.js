import { handleError, methodNotAllowed, requireUser, sendJson } from "../../_lib/supabase.js";

const ROLES = new Set(["operator", "reviewer", "read_only"]);

export default async function handler(req, res) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);
  try {
    const { client, user } = await requireUser(req);
    const workspaceId = String(req.query.id || "");
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = typeof body.role === "string" ? body.role : "operator";
    if (!workspaceId || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ROLES.has(role)) {
      return sendJson(res, 400, { error: "Informe workspace válido, e-mail válido e papel operator, reviewer ou read_only." });
    }
    // RLS enforces that only an active workspace owner can create invitations.
    const { data, error } = await client.from("workspace_invitations").insert({
      workspace_id: workspaceId,
      email,
      role,
      invited_by: user.id,
      status: "pending"
    }).select("id,workspace_id,email,role,status,created_at").single();
    if (error) throw error;
    return sendJson(res, 201, {
      invitation: data,
      notice: "Convite registrado. O envio de e-mail e a aceitação do convite ainda precisam ser conectados ao provedor de autenticação."
    });
  } catch (error) {
    return handleError(res, error);
  }
}
