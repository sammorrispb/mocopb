-- 0003 — re-point user FKs from auth.users to club_profiles
-- so PostgREST can resolve `profile:club_profiles(...)` embeds.
-- Cascade chain is preserved via club_profiles.id → auth.users.id
-- (deleting an auth.users row cascades to club_profiles, which then
-- cascades to all coupled rows).
--
-- Without this, the chat / member list / event roster / attendance
-- views all silently fetched empty results because PostgREST couldn't
-- resolve the relationship from public.club_group_messages (etc.) to
-- public.club_profiles. Bug surfaced during E2E test on 2026-05-05.

alter table public.club_group_messages drop constraint club_group_messages_user_id_fkey;
alter table public.club_group_messages add constraint club_group_messages_user_id_fkey
  foreign key (user_id) references public.club_profiles(id) on delete cascade;

alter table public.club_group_members drop constraint club_group_members_user_id_fkey;
alter table public.club_group_members add constraint club_group_members_user_id_fkey
  foreign key (user_id) references public.club_profiles(id) on delete cascade;

alter table public.club_event_registrations drop constraint club_event_registrations_user_id_fkey;
alter table public.club_event_registrations add constraint club_event_registrations_user_id_fkey
  foreign key (user_id) references public.club_profiles(id) on delete cascade;

alter table public.club_notifications drop constraint club_notifications_user_id_fkey;
alter table public.club_notifications add constraint club_notifications_user_id_fkey
  foreign key (user_id) references public.club_profiles(id) on delete cascade;

alter table public.club_event_changes drop constraint club_event_changes_changed_by_fkey;
alter table public.club_event_changes add constraint club_event_changes_changed_by_fkey
  foreign key (changed_by) references public.club_profiles(id) on delete set null;

alter table public.club_events drop constraint club_events_created_by_fkey;
alter table public.club_events add constraint club_events_created_by_fkey
  foreign key (created_by) references public.club_profiles(id) on delete restrict;

alter table public.club_groups drop constraint club_groups_created_by_fkey;
alter table public.club_groups add constraint club_groups_created_by_fkey
  foreign key (created_by) references public.club_profiles(id) on delete restrict;
