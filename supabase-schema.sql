-- Banco compartilhado do simulador 00a.
-- Execute no SQL Editor do seu projeto Supabase.
-- É um simulador: não representa o sistema oficial da Justiça Eleitoral.

create table if not exists public.simulations (
  id uuid primary key,
  name text not null,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.votes (
  id uuid primary key,
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  terminal_id text not null,
  created_at timestamptz not null default now(),
  selections jsonb not null
);

create index if not exists votes_simulation_id_idx on public.votes(simulation_id);
create index if not exists votes_created_at_idx on public.votes(created_at);

alter table public.simulations enable row level security;
alter table public.votes enable row level security;

-- Para uma simulação de laboratório sem login, o acesso é limitado às tabelas
-- e aos campos necessários. Para uso real, substitua estas políticas por Auth.
drop policy if exists "public can read simulations" on public.simulations;
drop policy if exists "public can create simulations" on public.simulations;
drop policy if exists "public can update simulations" on public.simulations;
drop policy if exists "public can read votes" on public.votes;
drop policy if exists "public can insert votes" on public.votes;

create policy "public can read simulations"
on public.simulations for select to anon, authenticated using (true);

create policy "public can create simulations"
on public.simulations for insert to anon, authenticated with check (true);

create policy "public can update simulations"
on public.simulations for update to anon, authenticated using (true) with check (true);

create policy "public can read votes"
on public.votes for select to anon, authenticated using (true);

create policy "public can insert votes"
on public.votes for insert to anon, authenticated with check (true);

-- Habilita a tabela para Postgres Changes / Realtime.
alter publication supabase_realtime add table public.votes;
alter publication supabase_realtime add table public.simulations;
