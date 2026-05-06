import Link from "next/link";
import Image from "next/image";
import { type Court, getCourtImage } from "@/lib/courts";

export function CourtCard({ court }: { court: Court }) {
  const image = getCourtImage(court);
  return (
    <Link href={`/courts/${court.slug}`} className="card-moco block overflow-hidden">
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={image}
          alt={`${court.name} pickleball courts`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow ${
            court.type === "indoor" ? "badge-indoor" : "badge-outdoor"
          }`}
        >
          {court.type === "indoor" ? "Indoor" : "Outdoor"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-text-primary mb-1">
          {court.name}
        </h3>
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
      </div>
    </Link>
  );
}
