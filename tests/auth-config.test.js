import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const clientSource = await readFile(new URL("../app/supabase/client.js", import.meta.url), "utf8");
const guardSource = await readFile(new URL("../app/auth/route-guard.js", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

test("Supabase browser client uses only Vite public config and persistent sessions", () => {
  assert.match(clientSource, /VITE_SUPABASE_URL/);
  assert.match(clientSource, /VITE_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(clientSource, /persistSession:\s*true/);
  assert.match(clientSource, /autoRefreshToken:\s*true/);
  assert.doesNotMatch(clientSource, /SERVICE_ROLE|sb_secret_|service_role/i);
});

test("protected route names are declared centrally", () => {
  assert.match(guardSource, /PRIVATE_ROUTES\s*=\s*new Set\(\["\/app", "\/workspace", "\/history"\]\)/);
  assert.match(guardSource, /auth\.getUser\(\)/);
  assert.match(guardSource, /auth\.signOut\(\)/);
});

test("Supabase SDK is declared as an application dependency", () => {
  assert.ok(packageJson.dependencies?.["@supabase/supabase-js"]);
});
