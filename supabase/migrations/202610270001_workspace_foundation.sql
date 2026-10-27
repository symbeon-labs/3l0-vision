-- 3L0 Vision workspace foundation
-- Apply through the Supabase SQL editor or Supabase CLI before enabling the API.
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  name text not null check (char_length(trim(name)) between 1 and 120),
  objective text not null check (char_length(trim(objective)) between 1 and 240),
  current_process text not null check (char_length(trim(current_process)) between 1 and 1200),
  systems jsonb not null default '[]'::jsonb check (jsonb_typeof(systems) = 'array'),
  success_criteria jsonb not null check (jsonb_typeof(success_criteria) = 'array' and jsonb_array_length(success_criteria) > 0),
  status text not null default 'draft' check (status in ('draft','active','suspended')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_memberships (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check (role in ('workspace_owner','operator','reviewer','read_only')),
  status text not null default 'active' check (status in ('invited','active','suspended','revoked')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table if not exists public.workspace_invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null check (char_length(email) <= 254),
  role text not null check (role in ('operator','reviewer','read_only')),
  invited_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending','accepted','expired','revoked')),
  created_at timestamptz not null default now(),
  unique (workspace_id, email)
);

create index if not exists workspace_memberships_user_status_idx
  on public.workspace_memberships(user_id, status);
create index if not exists workspace_invitations_workspace_status_idx
  on public.workspace_invitations(workspace_id, status);

alter table public.organizations enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_memberships enable row level security;
alter table public.workspace_invitations enable row level security;

-- SECURITY DEFINER helpers avoid recursive RLS evaluation when policies inspect memberships.
create or replace function public.is_active_workspace_member(p_workspace_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.workspace_memberships m
    where m.workspace_id = p_workspace_id and m.user_id = auth.uid() and m.status = 'active');
$$;

create or replace function public.is_active_workspace_owner(p_workspace_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.workspace_memberships m
    where m.workspace_id = p_workspace_id and m.user_id = auth.uid()
      and m.role = 'workspace_owner' and m.status = 'active');
$$;

revoke all on function public.is_active_workspace_member(uuid) from public, anon;
revoke all on function public.is_active_workspace_owner(uuid) from public, anon;
grant execute on function public.is_active_workspace_member(uuid) to authenticated;
grant execute on function public.is_active_workspace_owner(uuid) to authenticated;

-- Membership is the tenant boundary. A user can only see rows belonging to a workspace
-- where they have an active membership; never trust a workspace_id supplied by the browser.
create policy "members read own organizations" on public.organizations
  for select to authenticated using (
    exists (select 1 from public.workspaces w where w.organization_id = organizations.id and public.is_active_workspace_member(w.id))
  );

create policy "members read workspaces" on public.workspaces
  for select to authenticated using (
    public.is_active_workspace_member(workspaces.id)
  );

create policy "members read memberships" on public.workspace_memberships
  for select to authenticated using (
    public.is_active_workspace_member(workspace_memberships.workspace_id)
  );

create policy "owners create invitations" on public.workspace_invitations
  for insert to authenticated with check (
    invited_by = auth.uid() and public.is_active_workspace_owner(workspace_invitations.workspace_id)
  );

create policy "owners read invitations" on public.workspace_invitations
  for select to authenticated using (
    public.is_active_workspace_owner(workspace_invitations.workspace_id)
  );

-- Atomic organization + workspace + owner membership creation. No service-role key required.
create or replace function public.create_workspace_with_org(
  p_organization_name text,
  p_workspace_name text,
  p_objective text,
  p_current_process text,
  p_systems jsonb default '[]'::jsonb,
  p_success_criteria jsonb default '[]'::jsonb
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_org public.organizations;
  v_workspace public.workspaces;
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if nullif(trim(p_organization_name), '') is null
    or nullif(trim(p_workspace_name), '') is null
    or nullif(trim(p_objective), '') is null
    or nullif(trim(p_current_process), '') is null
    or jsonb_typeof(coalesce(p_systems, '[]'::jsonb)) <> 'array'
    or jsonb_typeof(coalesce(p_success_criteria, '[]'::jsonb)) <> 'array'
    or jsonb_array_length(coalesce(p_success_criteria, '[]'::jsonb)) = 0 then
    raise exception 'Invalid workspace input' using errcode = '22023';
  end if;
  insert into public.organizations(name, created_by)
  values (trim(p_organization_name), v_user_id) returning * into v_org;
  insert into public.workspaces(organization_id, name, objective, current_process, systems, success_criteria, created_by)
  values (v_org.id, trim(p_workspace_name), trim(p_objective), trim(p_current_process),
    coalesce(p_systems, '[]'::jsonb), p_success_criteria, v_user_id)
  returning * into v_workspace;
  insert into public.workspace_memberships(workspace_id, user_id, role, status)
  values (v_workspace.id, v_user_id, 'workspace_owner', 'active');
  return jsonb_build_object(
    'id', v_workspace.id,
    'organizationId', v_org.id,
    'organizationName', v_org.name,
    'name', v_workspace.name,
    'objective', v_workspace.objective,
    'currentProcess', v_workspace.current_process,
    'systems', v_workspace.systems,
    'successCriteria', v_workspace.success_criteria,
    'status', v_workspace.status,
    'createdAt', v_workspace.created_at
  );
end;
$$;

revoke all on function public.create_workspace_with_org(text,text,text,text,jsonb,jsonb) from public, anon;
grant execute on function public.create_workspace_with_org(text,text,text,text,jsonb,jsonb) to authenticated;

grant select on public.organizations, public.workspaces, public.workspace_memberships, public.workspace_invitations to authenticated;
grant insert on public.workspace_invitations to authenticated;
