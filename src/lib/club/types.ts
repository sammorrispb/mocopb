// Hand-written DB row types for /club. Mirrors 0001_club_schema.sql.
// Replace with `supabase gen types` output once the migration is applied.

export type ClubProfile = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
};

export type GroupVisibility = "open" | "invite";

export type ClubGroup = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  visibility: GroupVisibility;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type GroupMemberRole = "admin" | "member";

export type ClubGroupMember = {
  group_id: string;
  user_id: string;
  role: GroupMemberRole;
  joined_at: string;
};

export type ClubGroupMessage = {
  id: number;
  group_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export type ClubEventStatus = "scheduled" | "cancelled";

export type ClubEvent = {
  id: string;
  group_id: string;
  title: string;
  description: string | null;
  location: string;
  starts_at: string;
  ends_at: string | null;
  capacity: number;
  status: ClubEventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type RegistrationStatus =
  | "registered"
  | "waitlisted"
  | "cancelled"
  | "attended"
  | "no_show";

export type ClubEventRegistration = {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  position: number | null;
  registered_at: string;
  attended_marked_at: string | null;
};

export type ClubNotificationStatus = "pending" | "sent" | "failed";

export type ClubNotification = {
  id: number;
  user_id: string;
  event_id: string | null;
  type: string;
  channel: "email";
  payload: Record<string, unknown>;
  status: ClubNotificationStatus;
  attempts: number;
  created_at: string;
  sent_at: string | null;
  error: string | null;
};
