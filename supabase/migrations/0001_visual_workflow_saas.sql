create extension if not exists "pgcrypto";

create type public.workspace_role as enum ('owner', 'admin', 'editor', 'commenter', 'viewer');
create type public.workflow_role as enum ('owner', 'editor', 'commenter', 'viewer');
create type public.plan_id as enum ('free', 'warrior', 'elite', 'champion', 'legend');
create type public.workflow_status as enum ('draft', 'active', 'archived', 'published');
create type public.template_visibility as enum ('private', 'workspace');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  language text not null default 'ar' check (language in ('ar', 'en')),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  editor_layout jsonb not null default '{}'::jsonb,
  collapsed_panels jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  plan public.plan_id not null default 'legend',
  trial_ends_at timestamptz not null default now() + interval '14 days',
  created_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.dashboards (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflows (
  id uuid primary key default gen_random_uuid(),
  dashboard_id uuid references public.dashboards(id) on delete set null,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text,
  status public.workflow_status not null default 'draft',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_nodes (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  type text not null,
  position jsonb not null default '{"x":0,"y":0}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  style jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_edges (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  source_node_id uuid not null references public.workflow_nodes(id) on delete cascade,
  target_node_id uuid not null references public.workflow_nodes(id) on delete cascade,
  source_handle text,
  target_handle text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_versions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  snapshot jsonb not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.workflow_comments (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  node_id uuid references public.workflow_nodes(id) on delete cascade,
  body text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workflow_activity (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.workflow_shares (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role public.workflow_role not null default 'viewer',
  public_token text unique,
  expires_at timestamptz,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.custom_node_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  name text not null,
  description text,
  base_type text not null,
  icon text,
  color text,
  default_data jsonb not null default '{}'::jsonb,
  default_style jsonb not null default '{}'::jsonb,
  handles jsonb not null default '{}'::jsonb,
  validation_schema jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  visibility public.template_visibility not null default 'private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_favorite_nodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  node_type text,
  custom_node_template_id uuid references public.custom_node_templates(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (node_type is not null or custom_node_template_id is not null)
);

create unique index user_favorite_system_nodes_unique
on public.user_favorite_nodes (user_id, node_type)
where node_type is not null;

create unique index user_favorite_custom_nodes_unique
on public.user_favorite_nodes (user_id, custom_node_template_id)
where custom_node_template_id is not null;

create table public.subscriptions (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  plan public.plan_id not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'trialing',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table public.plan_usage (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  workflows int not null default 0,
  dashboards int not null default 0,
  nodes int not null default 0,
  custom_elements int not null default 0,
  favorites int not null default 0,
  ai_credits_used int not null default 0,
  collaborators int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  workflow_id uuid references public.workflows(id) on delete set null,
  user_id uuid not null references public.profiles(id),
  provider text not null check (provider in ('openai', 'gemini')),
  task text not null,
  credits_used int not null default 1,
  prompt_summary text,
  created_at timestamptz not null default now()
);

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security invoker
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace_id and wm.user_id = auth.uid()
  );
$$;

create or replace function public.workspace_member_role(target_workspace_id uuid)
returns public.workspace_role
language sql
stable
security invoker
as $$
  select wm.role from public.workspace_members wm
  where wm.workspace_id = target_workspace_id and wm.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.can_edit_workspace(target_workspace_id uuid)
returns boolean
language sql
stable
security invoker
as $$
  select public.workspace_member_role(target_workspace_id) in ('owner', 'admin', 'editor');
$$;

create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  new_dashboard_id uuid;
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.user_preferences (user_id) values (new.id);

  insert into public.workspaces (name, owner_id)
  values ('My workspace', new.id)
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, new.id, 'owner');

  insert into public.subscriptions (workspace_id, plan, status)
  values (new_workspace_id, 'legend', 'trialing');

  insert into public.plan_usage (workspace_id)
  values (new_workspace_id);

  insert into public.dashboards (workspace_id, name, created_by)
  values (new_workspace_id, 'Main dashboard', new.id)
  returning id into new_dashboard_id;

  insert into public.workflows (dashboard_id, workspace_id, name, description, status, created_by)
  values (new_dashboard_id, new_workspace_id, 'First workflow', 'Your first collaborative workflow', 'draft', new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.dashboards enable row level security;
alter table public.workflows enable row level security;
alter table public.workflow_nodes enable row level security;
alter table public.workflow_edges enable row level security;
alter table public.workflow_versions enable row level security;
alter table public.workflow_comments enable row level security;
alter table public.workflow_activity enable row level security;
alter table public.workflow_shares enable row level security;
alter table public.custom_node_templates enable row level security;
alter table public.user_favorite_nodes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plan_usage enable row level security;
alter table public.ai_requests enable row level security;

create policy "Profiles are visible to members" on public.profiles for select using (id = auth.uid());
create policy "Users update own profile" on public.profiles for update using (id = auth.uid());

create policy "Users manage preferences" on public.user_preferences for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Members read workspaces" on public.workspaces for select using (public.is_workspace_member(id));
create policy "Owners update workspaces" on public.workspaces for update using (owner_id = auth.uid());

create policy "Members read membership" on public.workspace_members for select using (public.is_workspace_member(workspace_id));
create policy "Admins manage membership" on public.workspace_members for all using (public.workspace_member_role(workspace_id) in ('owner', 'admin')) with check (public.workspace_member_role(workspace_id) in ('owner', 'admin'));

create policy "Members read dashboards" on public.dashboards for select using (public.is_workspace_member(workspace_id));
create policy "Editors manage dashboards" on public.dashboards for all using (public.can_edit_workspace(workspace_id)) with check (public.can_edit_workspace(workspace_id));

create policy "Members read workflows" on public.workflows for select using (public.is_workspace_member(workspace_id));
create policy "Editors manage workflows" on public.workflows for all using (public.can_edit_workspace(workspace_id)) with check (public.can_edit_workspace(workspace_id));

create policy "Members read nodes" on public.workflow_nodes for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Editors manage nodes" on public.workflow_nodes for all using (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id))) with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id)));

create policy "Members read edges" on public.workflow_edges for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Editors manage edges" on public.workflow_edges for all using (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id))) with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id)));

create policy "Members read versions" on public.workflow_versions for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Editors create versions" on public.workflow_versions for insert with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id)));

create policy "Members read comments" on public.workflow_comments for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Commenters create comments" on public.workflow_comments for insert with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Comment owners update comments" on public.workflow_comments for update using (created_by = auth.uid());

create policy "Members read activity" on public.workflow_activity for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Members create activity" on public.workflow_activity for insert with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));

create policy "Members read shares" on public.workflow_shares for select using (exists (select 1 from public.workflows w where w.id = workflow_id and public.is_workspace_member(w.workspace_id)));
create policy "Editors manage shares" on public.workflow_shares for all using (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id))) with check (exists (select 1 from public.workflows w where w.id = workflow_id and public.can_edit_workspace(w.workspace_id)));

create policy "Members read custom templates" on public.custom_node_templates for select using (public.is_workspace_member(workspace_id) and (visibility = 'workspace' or created_by = auth.uid()));
create policy "Editors manage custom templates" on public.custom_node_templates for all using (public.can_edit_workspace(workspace_id) or created_by = auth.uid()) with check (public.can_edit_workspace(workspace_id) or created_by = auth.uid());

create policy "Users manage favorites" on public.user_favorite_nodes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Members read subscriptions" on public.subscriptions for select using (public.is_workspace_member(workspace_id));
create policy "Members read usage" on public.plan_usage for select using (public.is_workspace_member(workspace_id));
create policy "Members read ai requests" on public.ai_requests for select using (public.is_workspace_member(workspace_id));
create policy "Members create ai requests" on public.ai_requests for insert with check (public.is_workspace_member(workspace_id) and user_id = auth.uid());

alter publication supabase_realtime add table public.workflow_nodes;
alter publication supabase_realtime add table public.workflow_edges;
alter publication supabase_realtime add table public.workflow_comments;
alter publication supabase_realtime add table public.workflow_activity;
