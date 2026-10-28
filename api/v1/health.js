import { sendJson } from "../_lib/supabase.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Método não permitido." });
  }
  return sendJson(res, 200, {
    status: "ok",
    service: "3l0-vision-api",
    apiVersion: "v1",
    resolutionMode: "deterministic-local-demo",
    authentication: "required-for-resolve",
    workspaceAuthorization: "required-for-resolve",
    persistence: "workspace-scoped-resolution-runs",
    externalOrc: false,
    productionReady: false
  });
}
