import Link from "next/link";
import type { Court } from "@/lib/courts";

export function CourtCard({ court }: { court: Court }) {
  return (
    <Link href={`/courts/${court.slug}`} className="card-moco block p-5">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading font-semibold text-lg text-text-primary">
          {court.name}
        </h3>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            court.type === "indoor" ? "badge-indoor" : "badge-outdoor"
          }`}
        >
          {court.type === "indoor" ? "Indoor" : "Outdoor"}
        </span>
      </div>
      <p className="text-sm text-text-muted mb-3">
        {court.address}, {court.city}, MD {court.zip}
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-text-muted">
        <span className="bg-gray-100 px-2 py-1 rounded">
          {court.courtCount} courts
        </span>
        {court.amenities.slice(0, 3).map((a) => (
          <span key={a} className="bg-gray-100 px-2 py-1 rounded">
            {a}
          </span>
        ))}
      </div>
    </Link>
  );
}
