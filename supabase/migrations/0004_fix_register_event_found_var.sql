-- 0004 — fix club_register_for_event using PL/pgSQL FOUND across SELECTs
--
-- The intermediate `select count(*) into v_count` overwrites FOUND, so the
-- subsequent `if found then update ...` branch fired even when there was
-- no existing registration. The UPDATE then ran against a NULL id, matched
-- zero rows, and the function returned a row of NULLs instead of inserting.
-- Bug surfaced during E2E test on 2026-05-05 (RSVP appeared to no-op).
--
-- Fix: snapshot whether v_existing was actually found into a dedicated
-- boolean before any further SELECTs.

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
  v_has_existing boolean := false;
  v_reg public.club_event_registrations;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  select * into v_event from public.club_events where id = p_event_id for update;
  if not found then raise exception 'event not found'; end if;
  if v_event.status <> 'scheduled' then raise exception 'event not open for registration'; end if;

  if not public.club_is_member(v_event.group_id, v_user) then
    raise exception 'not a member of this group';
  end if;

  select * into v_existing
  from public.club_event_registrations
  where event_id = p_event_id and user_id = v_user;
  v_has_existing := found;

  if v_has_existing and v_existing.status in ('registered','waitlisted','attended') then
    return v_existing;
  end if;

  select count(*) into v_count
  from public.club_event_registrations
  where event_id = p_event_id and status = 'registered';

  if v_count < v_event.capacity then
    if v_has_existing then
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
    select coalesce(max(position), 0) + 1 into v_position
    from public.club_event_registrations
    where event_id = p_event_id and status = 'waitlisted';

    if v_has_existing then
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

  insert into public.club_notifications (user_id, event_id, type, payload)
  values (v_user, p_event_id,
          case v_reg.status when 'registered' then 'rsvp_confirmed' else 'waitlist_added' end,
          jsonb_build_object('position', v_reg.position));

  return v_reg;
end $$;
