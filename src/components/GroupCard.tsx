import { hubUrl } from "@/lib/tracking";
import type { Group } from "@/lib/groups";

export function GroupCard({ group }: { group: Group }) {
  const href =
    group.platform === "linkanddink" && group.hubPath
      ? hubUrl(group.hubPath, "groups_page", group.slug)
      : group.externalUrl || "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`card-moco block p-5 ${group.featured ? "border-court-green/20" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-heading font-semibold text-lg text-text-primary">
          {group.name}
        </h3>
        {group.featured && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-court-green/10 text-court-green border border-court-green/20">
            Featured
          </span>
        )}
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
    </a>
  );
}
