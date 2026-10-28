-- Restrict resolution persistence to authenticated workspace members.
-- Keep membership/ownership helpers outside PostgREST's exposed public schema.
BEGIN;

REVOKE ALL PRIVILEGES ON TABLE public.resolution_runs FROM anon;

CREATE SCHEMA IF NOT EXISTS private AUTHORIZATION postgres;
REVOKE ALL PRIVILEGES ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;

ALTER FUNCTION public.is_active_workspace_member(uuid) SET SCHEMA private;
ALTER FUNCTION public.is_active_workspace_owner(uuid) SET SCHEMA private;

REVOKE ALL PRIVILEGES ON FUNCTION private.is_active_workspace_member(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL PRIVILEGES ON FUNCTION private.is_active_workspace_owner(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_active_workspace_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_active_workspace_owner(uuid) TO authenticated;

COMMIT;
