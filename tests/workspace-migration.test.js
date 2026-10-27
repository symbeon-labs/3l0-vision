import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migrationUrl = new URL("../supabase/migrations/202610270001_workspace_foundation.sql", import.meta.url);
const migration = await readFile(migrationUrl, "utf8");

test("workspace migration has balanced PostgreSQL dollar-quoted function bodies", () => {
  assert.equal((migration.match(/\$\$/g) || []).length % 2, 0);
  assert.match(migration, /as \$\$[\s\S]*?\$\$;/);
  assert.doesNotMatch(migration, /as \$\s*\n/);
});

test("workspace tables enable row-level security", () => {
  for (const table of ["organizations", "workspaces", "workspace_memberships", "workspace_invitations"]) {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security;`));
  }
});

test("workspace creation RPC requires an authenticated caller and creates an owner membership", () => {
  assert.match(migration, /create or replace function public\.create_workspace_with_org/);
  assert.match(migration, /if v_user_id is null then raise exception 'Authentication required'/);
  assert.match(migration, /values \(v_workspace\.id, v_user_id, 'workspace_owner', 'active'\)/);
  assert.match(migration, /grant execute on function public\.create_workspace_with_org[\s\S]*to authenticated;/);
});

test("invitation insertion is restricted to active workspace owners", () => {
  assert.match(migration, /create policy "owners create invitations"[\s\S]*public\.is_active_workspace_owner\(workspace_invitations\.workspace_id\)/);
  assert.match(migration, /role in \('operator','reviewer','read_only'\)/);
});
