-- Durable, workspace-scoped audit history for the receiving vertical slice.
create table if not exists public.resolution_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  resolution_id text not null,
  status text not null check (status in ('RESOLVED','UNCERTAIN','INSUFFICIENT_EVIDENCE','CONFLICT','ERROR')),
  state jsonb not null default '{}'::jsonb,
  input_scheme text not null check (char_length(input_scheme) between 1 and 40),
  input_code text not null check (char_length(input_code) between 1 and 128),
  observation jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (workspace_id, resolution_id)
);

create index if not exists resolution_runs_workspace_created_idx
  on public.resolution_runs (workspace_id, created_at desc);
create index if not exists resolution_runs_user_id_idx
  on public.resolution_runs (user_id);

alter table public.resolution_runs enable row level security;

create policy "workspace members can read resolution runs"
on public.resolution_runs for select to authenticated
using (
  exists (
    select 1 from public.workspace_memberships m
    where m.workspace_id = resolution_runs.workspace_id
      and m.user_id = (select auth.uid())
      and m.status = 'active'
  )
);

create policy "active workspace members can insert own resolution runs"
on public.resolution_runs for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.workspace_memberships m
    where m.workspace_id = resolution_runs.workspace_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  )
);

grant select, insert on public.resolution_runs to authenticated;
