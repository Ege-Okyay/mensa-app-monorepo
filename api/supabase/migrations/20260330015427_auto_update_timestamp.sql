create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_mensa_current_menus_updated_at
before update on mensa_current_menus
for each row
execute function update_updated_at_column();