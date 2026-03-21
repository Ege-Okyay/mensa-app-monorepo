create table
    mensas (
        id uuid primary key default gen_random_uuid (),
        slug text not null unique,
        name text not null
    );

create table
    mensa_current_menus (
        mensa_id uuid primary key references mensas (id) on delete cascade,
        menu_data jsonb not null,
        updated_at timestamptz default now ()
    );