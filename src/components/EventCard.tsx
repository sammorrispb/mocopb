import { hubUrl } from "@/lib/hub";
import type { Event } from "@/lib/events";
import { EVENT_TYPE_LABELS } from "@/lib/events";

const TYPE_COLORS: Record<Event["type"], string> = {
  tournament: "bg-purple-100 text-purple-700 border-purple-200",
  social: "bg-amber-100 text-amber-700 border-amber-200",
  clinic: "bg-blue-100 text-blue-700 border-blue-200",
  "open-play": "bg-green-100 text-green-700 border-green-200",
  league: "bg-red-100 text-red-700 border-red-200",
};

export function EventCard({ event }: { event: Event }) {
  const href = event.hubPath
    ? hubUrl(event.hubPath, "events_page", event.slug)
    : event.registrationUrl || "#";

  const dateObj = new Date(event.date + "T12:00:00");
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const day = dateObj.getDate();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card-moco block p-5"
    >
      <div className="flex gap-4">
        {/* Date badge */}
        <div className="flex-shrink-0 w-14 h-14 bg-bg-alt rounded-lg flex flex-col items-center justify-center">
          <span className="text-xs font-semibold text-court-green uppercase">{month}</span>
          <span className="text-lg font-bold text-text-primary leading-tight">{day}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-base text-text-primary truncate">
              {event.title}
            </h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${TYPE_COLORS[event.type]}`}>
              {EVENT_TYPE_LABELS[event.type]}
            </span>
          </div>
          <p className="text-sm text-text-muted">{event.time} &middot; {event.location}</p>
          <p className="text-sm text-text-muted mt-1 line-clamp-2">{event.description}</p>
        </div>
      </div>
    </a>
  );
}
