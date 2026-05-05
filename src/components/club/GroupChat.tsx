"use client";
import { useEffect, useRef, useState } from "react";
import { getClubBrowserClient } from "@/lib/club/supabase-browser";
import type { ClubGroupMessage } from "@/lib/club/types";

type DisplayMessage = ClubGroupMessage & { display_name: string };

type Props = {
  groupId: string;
  currentUserId: string;
  initialMessages: DisplayMessage[];
};

export function GroupChat({ groupId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<DisplayMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const nameCacheRef = useRef<Map<string, string>>(
    new Map(initialMessages.map((m) => [m.user_id, m.display_name]))
  );

  // Realtime subscribe to new messages.
  useEffect(() => {
    const supabase = getClubBrowserClient();
    const channel = supabase
      .channel(`group:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "club_group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload: { new: ClubGroupMessage }) => {
          const m = payload.new;
          let name = nameCacheRef.current.get(m.user_id);
          if (!name) {
            const { data } = await supabase
              .from("club_profiles")
              .select("display_name")
              .eq("id", m.user_id)
              .maybeSingle();
            const profile = data as { display_name: string } | null;
            name = profile?.display_name ?? "Player";
            nameCacheRef.current.set(m.user_id, name);
          }
          setMessages((prev) =>
            prev.some((p) => p.id === m.id) ? prev : [...prev, { ...m, display_name: name! }]
          );
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [groupId]);

  // Auto-scroll to bottom on new messages.
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setError(null);
    const supabase = getClubBrowserClient();
    const { error: insertError } = await supabase
      .from("club_group_messages")
      .insert({ group_id: groupId, user_id: currentUserId, body });
    if (insertError) setError(insertError.message);
    else setDraft("");
    setSending(false);
  }

  return (
    <div className="card-moco overflow-hidden flex flex-col" style={{ height: 420 }}>
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-text-muted text-sm">No messages yet — say hi.</p>
        )}
        {messages.map((m) => {
          const mine = m.user_id === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  mine ? "bg-court-green text-white" : "bg-gray-100 text-text-primary"
                }`}
              >
                {!mine && (
                  <div className="text-xs font-semibold opacity-80 mb-0.5">
                    {m.display_name}
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{m.body}</div>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={send} className="border-t border-gray-200 p-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message the group…"
          maxLength={2000}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
        />
        <button
          type="submit"
          disabled={sending || draft.trim().length === 0}
          className="rounded-lg bg-court-green px-4 py-2 text-sm font-semibold text-white hover:bg-court-green/90 disabled:opacity-60"
        >
          Send
        </button>
      </form>
      {error && (
        <p className="px-3 pb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
