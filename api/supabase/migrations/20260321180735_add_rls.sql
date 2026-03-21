alter table mensas enable row level security;

alter table mensa_current_menus enable row level security;

create policy "Allow public read" on mensas for
select
    using (true);

create policy "Allow public read" on mensa_current_menus for
select
    using (true);