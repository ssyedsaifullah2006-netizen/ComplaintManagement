do $$
begin
  if not exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    raise exception 'Required Supabase publication "supabase_realtime" does not exist';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'complaints'
  ) then
    alter publication supabase_realtime add table public.complaints;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'complaint_updates'
  ) then
    alter publication supabase_realtime add table public.complaint_updates;
  end if;
end $$;
