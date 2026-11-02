
alter table public.schemes add column if not exists department text;
alter table public.schemes add column if not exists description text;
alter table public.schemes add column if not exists source_last_updated date;
alter table public.schemes add column if not exists external_id text;
create unique index if not exists schemes_external_id_key on public.schemes(external_id) where external_id is not null;

create table public.collection_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  method text not null,
  total_available int,
  fetched int not null default 0,
  inserted int not null default 0,
  updated int not null default 0,
  unchanged int not null default 0,
  duplicates int not null default 0,
  failed int not null default 0,
  incomplete int not null default 0,
  not_applicable int not null default 0,
  tn_count int not null default 0,
  central_count int not null default 0,
  details jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert on public.collection_runs to authenticated;
grant all on public.collection_runs to service_role;
alter table public.collection_runs enable row level security;
create policy "Admins manage collection runs" on public.collection_runs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
