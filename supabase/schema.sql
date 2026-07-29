-- Pega y ejecuta todo este archivo en Supabase: Project > SQL Editor > New query > Run

create table if not exists public.reportes (
  id uuid primary key default gen_random_uuid(),
  proyecto text not null check (proyecto in ('mystylecases', 'liga-cancer', 'tennis', 'crm', 'campus-adep')),
  tipo text not null check (tipo in ('bug', 'mejora', 'recomendacion')),
  prioridad smallint not null default 2 check (prioridad in (1, 2, 3)),
  nombre text not null default 'Anónimo',
  estado text not null default 'nuevo' check (estado in ('nuevo', 'revision', 'resuelto')),
  que_hacia text,
  que_esperaba text,
  que_paso text,
  titulo text,
  descripcion text,
  fecha_entrega date,
  created_at timestamptz not null default now(),
  constraint contenido_valido check (
    (tipo = 'bug' and que_paso is not null and length(trim(que_paso)) > 0)
    or (tipo <> 'bug' and descripcion is not null and length(trim(descripcion)) > 0)
  )
);

alter table public.reportes enable row level security;

-- Cualquier visitante (cliente, sin login) puede CREAR un reporte, pero
-- nunca leer, actualizar ni borrar ninguno. Así un cliente jamás puede
-- ver los reportes de otro proyecto ni los suyos propios.
create policy "clientes_pueden_insertar"
  on public.reportes
  for insert
  to anon, authenticated
  with check (true);

-- Solo usuarios con sesión iniciada (tu equipo, vía /login) pueden leer.
create policy "equipo_puede_leer"
  on public.reportes
  for select
  to authenticated
  using (true);

-- Solo usuarios con sesión iniciada pueden actualizar (para cambiar estado).
create policy "equipo_puede_actualizar"
  on public.reportes
  for update
  to authenticated
  using (true)
  with check (true);

-- Aunque haya política de UPDATE, limitamos a nivel de columna: el
-- panel solo necesita cambiar "estado" y "fecha_entrega", nunca el
-- contenido del reporte.
revoke update on public.reportes from authenticated;
grant update (estado, fecha_entrega) on public.reportes to authenticated;

-- Solo el equipo (con sesión iniciada) puede borrar reportes.
create policy "equipo_puede_borrar"
  on public.reportes
  for delete
  to authenticated
  using (true);

create index if not exists reportes_proyecto_idx on public.reportes (proyecto);
