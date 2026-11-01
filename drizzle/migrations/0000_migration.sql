
create type public.app_role as enum ('admin','user');
create type public.scheme_status as enum ('active','expired','discontinued','needs_verification');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Admins manage roles" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- first registered account becomes admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_first_admin after insert on auth.users for each row execute function public.handle_first_admin();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

create table public.schemes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  name_ta text,
  level text not null default 'central' check (level in ('central','state')),
  states text[],
  category text not null default 'other',
  is_scholarship boolean not null default false,
  is_sample boolean not null default false,
  summary text,
  benefits text,
  eligibility_text text,
  application_process text,
  official_url text,
  apply_url text,
  source_name text,
  source_url text,
  deadline date,
  deadline_note text,
  last_verified date,
  status scheme_status not null default 'needs_verification',
  min_age int,
  max_age int,
  genders text[],
  occupations text[],
  purposes text[],
  education_levels text[],
  communities text[],
  max_income numeric,
  tags text[],
  source_unavailable text[] not null default '{}',
  link_status int,
  link_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.schemes to anon, authenticated;
grant insert, update, delete on public.schemes to authenticated;
grant all on public.schemes to service_role;
alter table public.schemes enable row level security;
create policy "Public read schemes" on public.schemes for select to anon, authenticated using (true);
create policy "Admins write schemes" on public.schemes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger schemes_touch before update on public.schemes for each row execute function public.touch_updated_at();

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  name_ta text,
  issuing_authority text,
  eligibility text,
  supporting_docs text[] not null default '{}',
  steps text[] not null default '{}',
  online_url text,
  online_portal_name text,
  offline_process text,
  fees text,
  processing_time text,
  alternatives text,
  after_obtaining text,
  applies_to text not null default 'all',
  source_url text,
  last_verified date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.documents to anon, authenticated;
grant insert, update, delete on public.documents to authenticated;
grant all on public.documents to service_role;
alter table public.documents enable row level security;
create policy "Public read documents" on public.documents for select to anon, authenticated using (true);
create policy "Admins write documents" on public.documents for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger documents_touch before update on public.documents for each row execute function public.touch_updated_at();

create table public.scheme_documents (
  scheme_id uuid not null references public.schemes(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  reason text,
  mandatory boolean not null default true,
  primary key (scheme_id, document_id)
);
grant select on public.scheme_documents to anon, authenticated;
grant insert, update, delete on public.scheme_documents to authenticated;
grant all on public.scheme_documents to service_role;
alter table public.scheme_documents enable row level security;
create policy "Public read scheme docs" on public.scheme_documents for select to anon, authenticated using (true);
create policy "Admins write scheme docs" on public.scheme_documents for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  access_method text not null default 'manual',
  integration_status text not null default 'not_integrated',
  notes text,
  last_checked timestamptz,
  created_at timestamptz not null default now()
);
grant select on public.data_sources to anon, authenticated;
grant insert, update, delete on public.data_sources to authenticated;
grant all on public.data_sources to service_role;
alter table public.data_sources enable row level security;
create policy "Public read sources" on public.data_sources for select to anon, authenticated using (true);
create policy "Admins write sources" on public.data_sources for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.profile_submissions (
  id uuid primary key default gen_random_uuid(),
  state text, age int, occupation text, purpose text, income numeric,
  education text, gender text, community text,
  result_count int,
  created_at timestamptz not null default now()
);
grant insert on public.profile_submissions to anon, authenticated;
grant select on public.profile_submissions to authenticated;
grant all on public.profile_submissions to service_role;
alter table public.profile_submissions enable row level security;
create policy "Anyone can submit anonymous profile" on public.profile_submissions for insert to anon, authenticated with check (true);
create policy "Admins read submissions" on public.profile_submissions for select to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.import_logs (
  id uuid primary key default gen_random_uuid(),
  file_name text, inserted int default 0, updated int default 0, failed int default 0,
  created_by uuid, created_at timestamptz not null default now()
);
grant select, insert on public.import_logs to authenticated;
grant all on public.import_logs to service_role;
alter table public.import_logs enable row level security;
create policy "Admins import logs" on public.import_logs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
