import Image from "next/image";
import { type Group, getGroupImage } from "@/lib/groups";

function PlatformIcon({ platform }: { platform: Group["platform"] }) {
  if (platform === "facebook") {
    return (
      <svg
        aria-label="Facebook group"
        role="img"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[#1877F2]"
        fill="currentColor"
      >
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.412c0-3.017 1.792-4.683 4.533-4.683 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    );
  }
  if (platform === "whatsapp") {
    return (
      <svg
        aria-label="WhatsApp group"
        role="img"
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[#25D366]"
        fill="currentColor"
      >
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.595 5.39l-.999 3.648 3.893-1.013zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01a1.094 1.094 0 0 0-.793.372c-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
    );
  }
  return null;
}

export function GroupCard({ group }: { group: Group }) {
  const href = group.externalUrl || "#";
  const image = getGroupImage(group);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-moco block overflow-hidden ${group.featured ? "border-court-green/20" : ""}`}
    >
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={image}
          alt={`${group.name} pickleball community`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        {group.featured && (
          <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-court-green text-white shadow">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start gap-2 mb-2">
          <span className="mt-1">
            <PlatformIcon platform={group.platform} />
          </span>
          <h3 className="font-heading font-semibold text-lg text-text-primary">
            {group.name}
          </h3>
        </div>
        <p className="text-sm text-text-muted mb-3">{group.description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="bg-gray-100 px-2 py-1 rounded">{group.skillLevel}</span>
          <span className="bg-gray-100 px-2 py-1 rounded">{group.frequency}</span>
          {group.memberCount && (
            <span className="bg-gray-100 px-2 py-1 rounded">
              {group.memberCount.toLocaleString()} members
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
