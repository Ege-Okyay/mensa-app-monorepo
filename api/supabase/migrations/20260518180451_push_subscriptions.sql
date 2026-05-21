create table
    push_subscriptions (
        id UUID primary key default gen_random_uuid (),
        endpoint text not null unique,
        p256dh text not null,
        auth text not null,
        created_at timestamptz default now ()
    );

alter table push_subscriptions enable row level security;