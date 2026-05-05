-- mocopb /club v1 — schema, RLS, RPCs, triggers
-- All tables prefixed `club_` for clean separation if other features land later.
-- Auth: relies on Supabase auth.users (managed by GoTrue).
-- Notification flow: edits to events fire a trigger that enqueues notification rows;
-- the app sends synchronously after RPC returns; cron retries failed sends.

------------------------------------------------------------
-- 1. Tables
------------------------------------------------------------

create table if not exists public.club_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null check (length(display_name) between 1 and 60),
  avatar_url    text,
  phone         text,
  created_at    timestamptz not null default now()
);

create table if not exists public.club_groups (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]{3,40}$'),
  name         text not null check (length(name) between 1 and 80),
  description  text,
  visibility   text not null default 'invite' check (visibility in ('open','invite')),
  invite_code  text not null unique default encode(gen_random_bytes(8),'base64'),
  created_by   uuid not null references auth.users(id) on delete restrict,
  created_at   timestamptz not null default now()
);

create table if not exists public.club_group_members (
  group_id   uuid not null references public.club_groups(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('admin','member')),
  joined_at  timestamptz not null default now(),
  primary key (group_id, user_id)
);

create index if not exists idx_club_group_members_user
  on public.club_group_members(user_id);

create table if not exists public.club_group_messages (
  id          bigserial primary key,
  group_id    uuid not null references public.club_groups(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null check (length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);

create index if not exists idx_club_group_messages_group_created
  on public.club_group_messages(group_id, created_at desc);

create table if not exists public.club_events (
  id           uuid primary key default gen_random_uuid(),
  group_id     uuid not null references public.club_groups(id) on delete cascade,
  title        text not null check (length(title) between 1 and 120),
  description  text,
  location     text not null,
  starts_at    timestamptz not null,
  ends_at      timestamptz,
  capacity     int not null check (capacity between 1 and 200),
  status       text not null default 'scheduled' check (status in ('scheduled','cancelled')),
  created_by   uuid not null references auth.users(id) on delete restrict,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_club_events_group_starts
  on public.club_events(group_id, starts_at);

create table if not exists public.club_event_registrations (
  id                   uuid primary key default gen_random_uuid(),
  event_id             uuid not null references public.club_events(id) on delete cascade,
  user_id              uuid not null references auth.users(id) on delete cascade,
  status               text not null check (status in ('registered','waitlisted','cancelled','attended','no_show')),
  position             int,                 -- waitlist ordering, nullable for non-waitlisted
  registered_at        timestamptz not null default now(),
  attended_marked_at   timestamptz,
  unique (event_id, user_id)
);

create index if not exists idx_club_event_regs_event_status
  on public.club_event_registrations(event_id, status);
create index if not exists idx_club_event_regs_user
  on public.club_event_registrations(user_id);

create table if not exists public.club_event_changes (
  id          bigserial primary key,
  event_id    uuid not null references public.club_events(id) on delete cascade,
  changed_by  uuid references auth.users(id) on delete set null,
  field       text not null,
  old_value   text,
  new_value   text,
  changed_at  timestamptz not null default now()
);

create index if not exists idx_club_event_changes_event
  on public.club_event_changes(event_id, changed_at desc);

create table if not exists public.club_notifications (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_id    uuid references public.club_events(id) on delete cascade,
  type        text not null,
  channel     text not null default 'email' check (channel in ('email')),
  payload     jsonb not null default '{}'::jsonb,
  status      text not null default 'pending' check (status in ('pending','sent','failed')),
  attempts    int not null default 0,
  created_at  timestamptz not null default now(),
  sent_at     timestamptz,
  error       text
);

create index if not exists idx_club_notifications_pending
  on public.club_notifications(status, created_at) where status in ('pending','failed');

------------------------------------------------------------
-- 2. Helper functions
------------------------------------------------------------

-- Membership check used by many RLS policies. SECURITY DEFINER avoids RLS recursion
-- when policies on club_group_members reference itself.
create or replace function public.club_is_member(p_group uuid, p_user uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.club_group_members
    where group_id = p_group and user_id = p_user
  );
$$;

create or replace function public.club_is_admin(p_group uuid, p_user uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.club_group_members
    where group_id = p_group and user_id = p_user and role = 'admin'
  );
$$;

revoke all on function public.club_is_member(uuid, uuid) from public;
revoke all on function public.club_is_admin(uuid, uuid) from public;
grant execute on function public.club_is_member(uuid, uuid) to authenticated;
grant execute on function public.club_is_admin(uuid, uuid) to authenticated;

------------------------------------------------------------
-- 3. RLS — enable + policies
------------------------------------------------------------

alter table public.club_profiles            enable row level security;
alter table public.club_groups              enable row level security;
alter table public.club_group_members       enable row level security;
alter table public.club_group_messages      enable row level security;
alter table public.club_events              enable row level security;
alter table public.club_event_registrations enable row level security;
alter table public.club_event_changes       enable row level security;
alter table public.club_notifications       enable row level security;

-- profiles: anyone signed in can read; users update only their own.
create policy club_profiles_select on public.club_profiles
  for select to authenticated using (true);
create policy club_profiles_update_self on public.club_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy club_profiles_insert_self on public.club_profiles
  for insert to authenticated with check (id = auth.uid());

-- groups: members can see private groups; everyone signed in sees open groups.
create policy club_groups_select on public.club_groups
  for select to authenticated using (
    visibility = 'open' or public.club_is_member(id, auth.uid())
  );
create policy club_groups_insert on public.club_groups
  for insert to authenticated with check (created_by = auth.uid());
create policy club_groups_update_admin on public.club_groups
  for update to authenticated using (public.club_is_admin(id, auth.uid()))
  with check (public.club_is_admin(id, auth.uid()));

-- group_members: same-group members can list; admin manages; users can self-join open groups
-- or via accept-invite RPC; users can leave (delete self).
create policy club_group_members_select on public.club_group_members
  for select to authenticated using (
    public.club_is_member(group_id, auth.uid())
    or user_id = auth.uid()
  );
create policy club_group_members_insert on public.club_group_members
  for insert to authenticated with check (
    user_id = auth.uid()  -- self-join (open or via invite RPC)
    or public.club_is_admin(group_id, auth.uid())
  );
create policy club_group_members_delete on public.club_group_members
  for delete to authenticated using (
    user_id = auth.uid() or public.club_is_admin(group_id, auth.uid())
  );

-- group_messages: members read+post; no edits/deletes in v1.
create policy club_group_messages_select on public.club_group_messages
  for select to authenticated using (public.club_is_member(group_id, auth.uid()));
create policy club_group_messages_insert on public.club_group_messages
  for insert to authenticated with check (
    user_id = auth.uid() and public.club_is_member(group_id, auth.uid())
  );

-- events: group members read; admins write.
create policy club_events_select on public.club_events
  for select to authenticated using (public.club_is_member(group_id, auth.uid()));
create policy club_events_insert on public.club_events
  for insert to authenticated with check (
    created_by = auth.uid() and public.club_is_admin(group_id, auth.uid())
  );
create policy club_events_update on public.club_events
  for update to authenticated using (public.club_is_admin(group_id, auth.uid()))
  with check (public.club_is_admin(group_id, auth.uid()));

-- event_registrations: members of the event's group can read; users update own row;
-- admin sees all (covered by member rule for own group).
-- Inserts/updates go through RPC; we still allow direct insert for self in case
-- an admin wants to add a member outside the RPC.
create policy club_event_regs_select on public.club_event_registrations
  for select to authenticated using (
    exists (
      select 1 from public.club_events e
      where e.id = event_id and public.club_is_member(e.group_id, auth.uid())
    )
  );
create policy club_event_regs_insert_self on public.club_event_registrations
  for insert to authenticated with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.club_events e
      where e.id = event_id and public.club_is_admin(e.group_id, auth.uid())
    )
  );
create policy club_event_regs_update on public.club_event_registrations
  for update to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.club_events e
      where e.id = event_id and public.club_is_admin(e.group_id, auth.uid())
    )
  );

-- event_changes: read-only audit; group members can see history.
create policy club_event_changes_select on public.club_event_changes
  for select to authenticated using (
    exists (
      select 1 from public.club_events e
      where e.id = event_id and public.club_is_member(e.group_id, auth.uid())
    )
  );

-- notifications: read-only own rows. Inserts via triggers/RPC running as definer.
create policy club_notifications_select_self on public.club_notifications
  for select to authenticated using (user_id = auth.uid());

------------------------------------------------------------
-- 4. RPCs — register, cancel, attendance, accept_invite
------------------------------------------------------------

-- Register a user for an event. Atomic: locks the event row, counts current
-- registered headcount, decides registered vs waitlisted accordingly.
create or replace function public.club_register_for_event(p_event_id uuid)
returns public.club_event_registrations
language plpgsql security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_event public.club_events;
  v_count int;
  v_position int;
  v_existing public.club_event_registrations;
  v_reg public.club_event_registrations;
begin
  if v_user is null then
    raise exception 'not authenticated';
  end if;

  -- Lock the event row to serialize concurrent registers/cancels for this event.
  select * into v_event from public.club_events where id = p_event_id for update;
  if not found then raise exception 'event not found'; end if;
  if v_event.status <> 'scheduled' then raise exception 'event not open for registration'; end if;

  -- Caller must be a member of the event's group.
  if not public.club_is_member(v_event.group_id, v_user) then
    raise exception 'not a member of this group';
  end if;

  -- If already registered/waitlisted, return existing row.
  select * into v_existing
  from public.club_event_registrations
  where event_id = p_event_id and user_id = v_user;

  if found and v_existing.status in ('registered','waitlisted','attended') then
    return v_existing;
  end if;

  select count(*) into v_count
  from public.club_event_registrations
  where event_id = p_event_id and status = 'registered';

  if v_count < v_event.capacity then
    -- Open seat — register directly.
    if found then
      update public.club_event_registrations
         set status = 'registered', position = null, registered_at = now()
       where id = v_existing.id
       returning * into v_reg;
    else
      insert into public.club_event_registrations (event_id, user_id, status)
      values (p_event_id, v_user, 'registered')
      returning * into v_reg;
    end if;
  else
    -- Capacity full — append to waitlist.
    select coalesce(max(position), 0) + 1 into v_position
    from public.club_event_registrations
    where event_id = p_event_id and status = 'waitlisted';

    if found then
      update public.club_event_registrations
         set status = 'waitlisted', position = v_position, registered_at = now()
       where id = v_existing.id
       returning * into v_reg;
    else
      insert into public.club_event_registrations (event_id, user_id, status, position)
      values (p_event_id, v_user, 'waitlisted', v_position)
      returning * into v_reg;
    end if;
  end if;

  -- Enqueue confirmation notification for caller.
  insert into public.club_notifications (user_id, event_id, type, payload)
  values (v_user, p_event_id, case v_reg.status when 'registered' then 'rsvp_confirmed' else 'waitlist_added' end,
          jsonb_build_object('position', v_reg.position));

  return v_reg;
end $$;

revoke all on function public.club_register_for_event(uuid) from public;
grant execute on function public.club_register_for_event(uuid) to authenticated;

-- Cancel a registration. Locks the event, marks reg cancelled, promotes
-- the next waitlister if a registered seat opened up.
create or replace function public.club_cancel_registration(p_event_id uuid)
returns public.club_event_registrations
language plpgsql security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_event public.club_events;
  v_reg public.club_event_registrations;
  v_promo public.club_event_registrations;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  select * into v_event from public.club_events where id = p_event_id for update;
  if not found then raise exception 'event not found'; end if;

  select * into v_reg
  from public.club_event_registrations
  where event_id = p_event_id and user_id = v_user;
  if not found then raise exception 'no registration to cancel'; end if;
  if v_reg.status not in ('registered','waitlisted') then return v_reg; end if;

  update public.club_event_registrations
     set status = 'cancelled', position = null
   where id = v_reg.id
   returning * into v_reg;

  -- If a registered seat just opened, promote the head of the waitlist.
  if v_reg.status = 'cancelled' then
    select * into v_promo
    from public.club_event_registrations
    where event_id = p_event_id and status = 'waitlisted'
    order by position asc nulls last, registered_at asc
    limit 1
    for update;

    if found then
      -- Re-check capacity (defensive — should always be available here).
      if (select count(*) from public.club_event_registrations
           where event_id = p_event_id and status = 'registered') < v_event.capacity then
        update public.club_event_registrations
           set status = 'registered', position = null
         where id = v_promo.id
         returning * into v_promo;

        insert into public.club_notifications (user_id, event_id, type, payload)
        values (v_promo.user_id, p_event_id, 'waitlist_promoted', '{}'::jsonb);
      end if;
    end if;
  end if;

  return v_reg;
end $$;

revoke all on function public.club_cancel_registration(uuid) from public;
grant execute on function public.club_cancel_registration(uuid) to authenticated;

-- Admin: mark attendance for a registration. Caller must be group admin.
create or replace function public.club_mark_attendance(p_reg_id uuid, p_attended boolean)
returns public.club_event_registrations
language plpgsql security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_reg public.club_event_registrations;
  v_event public.club_events;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  select * into v_reg from public.club_event_registrations where id = p_reg_id;
  if not found then raise exception 'registration not found'; end if;

  select * into v_event from public.club_events where id = v_reg.event_id;
  if not public.club_is_admin(v_event.group_id, v_user) then
    raise exception 'not a group admin';
  end if;

  update public.club_event_registrations
     set status = case when p_attended then 'attended' else 'no_show' end,
         attended_marked_at = now()
   where id = p_reg_id
   returning * into v_reg;

  return v_reg;
end $$;

revoke all on function public.club_mark_attendance(uuid, boolean) from public;
grant execute on function public.club_mark_attendance(uuid, boolean) to authenticated;

-- Accept an invite by code. Adds caller to the group as member.
create or replace function public.club_accept_invite(p_code text)
returns public.club_groups
language plpgsql security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_group public.club_groups;
begin
  if v_user is null then raise exception 'not authenticated'; end if;

  select * into v_group from public.club_groups where invite_code = p_code;
  if not found then raise exception 'invalid invite'; end if;

  insert into public.club_group_members (group_id, user_id, role)
  values (v_group.id, v_user, 'member')
  on conflict (group_id, user_id) do nothing;

  return v_group;
end $$;

revoke all on function public.club_accept_invite(text) from public;
grant execute on function public.club_accept_invite(text) to authenticated;

------------------------------------------------------------
-- 5. Triggers — events: edit→notify, creator→admin, group creator→admin
------------------------------------------------------------

-- When a group is created, make the creator an admin.
create or replace function public.club_groups_after_insert()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.club_group_members (group_id, user_id, role)
  values (new.id, new.created_by, 'admin')
  on conflict (group_id, user_id) do update set role = 'admin';
  return new;
end $$;

drop trigger if exists club_groups_after_insert_trg on public.club_groups;
create trigger club_groups_after_insert_trg
  after insert on public.club_groups
  for each row execute function public.club_groups_after_insert();

-- On UPDATE of starts_at | location | status: log change + notify all current
-- registered/waitlisted users.
create or replace function public.club_events_before_update()
returns trigger language plpgsql security definer
set search_path = public
as $$
declare
  v_changed boolean := false;
  v_field text;
  v_old text;
  v_new text;
  v_actor uuid := auth.uid();
begin
  new.updated_at := now();

  if new.starts_at is distinct from old.starts_at then
    v_changed := true;
    v_field := 'starts_at'; v_old := old.starts_at::text; v_new := new.starts_at::text;
    insert into public.club_event_changes (event_id, changed_by, field, old_value, new_value)
      values (new.id, v_actor, v_field, v_old, v_new);
  end if;

  if new.location is distinct from old.location then
    v_changed := true;
    insert into public.club_event_changes (event_id, changed_by, field, old_value, new_value)
      values (new.id, v_actor, 'location', old.location, new.location);
  end if;

  if new.status is distinct from old.status then
    v_changed := true;
    insert into public.club_event_changes (event_id, changed_by, field, old_value, new_value)
      values (new.id, v_actor, 'status', old.status, new.status);
  end if;

  if v_changed then
    insert into public.club_notifications (user_id, event_id, type, payload)
    select r.user_id, new.id,
           case when new.status = 'cancelled' then 'event_cancelled' else 'event_changed' end,
           jsonb_build_object(
             'starts_at_old', old.starts_at,
             'starts_at_new', new.starts_at,
             'location_old', old.location,
             'location_new', new.location,
             'status_old', old.status,
             'status_new', new.status
           )
    from public.club_event_registrations r
    where r.event_id = new.id and r.status in ('registered','waitlisted');
  end if;

  return new;
end $$;

drop trigger if exists club_events_before_update_trg on public.club_events;
create trigger club_events_before_update_trg
  before update on public.club_events
  for each row execute function public.club_events_before_update();

------------------------------------------------------------
-- 6. Realtime — publish chat messages
------------------------------------------------------------

-- Add the chat table to the realtime publication so clients can subscribe.
alter publication supabase_realtime add table public.club_group_messages;

------------------------------------------------------------
-- 7. Auto-create profile on auth signup
------------------------------------------------------------
-- When a new user signs up, copy email's local part into display_name as a
-- starter so the UI never shows a blank name.

create or replace function public.club_handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.club_profiles (id, display_name)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'Player'))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists club_on_auth_user_created on auth.users;
create trigger club_on_auth_user_created
  after insert on auth.users
  for each row execute function public.club_handle_new_user();
