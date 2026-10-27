import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

export function createUserClient(token) {
  if (!url || !anonKey) {
    const error = new Error("Backend não configurado: defina SUPABASE_URL e SUPABASE_ANON_KEY.");
    error.statusCode = 503;
    throw error;
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function requireUser(req) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    const error = new Error("Autenticação obrigatória.");
    error.statusCode = 401;
    throw error;
  }
  const client = createUserClient(match[1]);
  const { data, error } = await client.auth.getUser(match[1]);
  if (error || !data?.user) {
    const authError = new Error("Token inválido ou expirado.");
    authError.statusCode = 401;
    throw authError;
  }
  return { client, user: data.user };
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader("Allow", allowed.join(", "));
  return sendJson(res, 405, { error: "Método não permitido." });
}

export function handleError(res, error) {
  const status = Number.isInteger(error?.statusCode) ? error.statusCode : 500;
  if (status >= 500) console.error("[api]", error?.message || "Erro inesperado");
  return sendJson(res, status, {
    error: status >= 500 ? "Falha interna ou backend não configurado." : error.message
  });
}
