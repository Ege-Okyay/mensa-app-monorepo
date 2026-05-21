alter table push_subscriptions
add column if not exists locale text default 'en'; 