alter table mensas
add column if not exists schedule jsonb default '{}'::jsonb;