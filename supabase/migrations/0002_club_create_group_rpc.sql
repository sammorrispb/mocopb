-- 0002 — atomic group creation RPC
-- The original direct INSERT through PostgREST was hitting an edge case where
-- the AFTER-INSERT trigger that adds the creator as admin races with the
-- RLS SELECT policy on the RETURNING clause for some users. SECURITY DEFINER
-- side-steps the issue and keeps the create-group flow to one round-trip.
--
-- Granted to authenticated only; auth.uid() is required.

create or replace function public.club_create_group(
  p_name text,
  p_description text,
  p_visibility text
) returns public.club_groups
language plpgsql security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_name text := nullif(btrim(p_name), '');
  v_desc text := nullif(btrim(p_description), '');
  v_vis  text := coalesce(p_visibility, 'invite');
  v_base text;
  v_slug text;
  v_group public.club_groups;
  v_attempts int := 0;
begin
  if v_user is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  if v_name is null then
    raise exception 'group name is required';
  end if;
  if length(v_name) > 80 then
    raise exception 'group name too long (max 80)';
  end if;
  if v_vis not in ('open','invite') then
    raise exception 'invalid visibility';
  end if;

  -- Normalize the slug. The CHECK constraint on club_groups.slug requires
  -- ^[a-z0-9-]{3,40}$ so we pad short names to 3+ chars.
  v_base := lower(v_name);
  v_base := regexp_replace(v_base, '[^a-z0-9]+', '-', 'g');
  v_base := regexp_replace(v_base, '(^-+|-+$)', '', 'g');
  v_base := substring(v_base from 1 for 32);
  if v_base is null or length(v_base) < 3 then
    v_base := 'group-' || substring(md5(random()::text) from 1 for 6);
  end if;

  v_slug := v_base;

  -- Try the base, then base-N suffixes for collision retry.
  while v_attempts < 6 loop
    begin
      insert into public.club_groups (slug, name, description, visibility, created_by)
      values (v_slug, v_name, v_desc, v_vis, v_user)
      returning * into v_group;
      return v_group;
    exception
      when unique_violation then
        v_attempts := v_attempts + 1;
        v_slug := substring(v_base from 1 for 32) || '-' || (floor(random()*9000) + 1000)::text;
    end;
  end loop;

  raise exception 'could not allocate a unique slug after % attempts', v_attempts;
end $$;

revoke all on function public.club_create_group(text, text, text) from public;
grant execute on function public.club_create_group(text, text, text) to authenticated;
