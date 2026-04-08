import { hubUrl } from "@/lib/tracking";

interface HubLinkProps {
  path?: string;
  campaign?: string;
  content?: string;
  className?: string;
  children: React.ReactNode;
}

export function HubLink({
  path = "/",
  campaign = "mocopb_link",
  content,
  className = "",
  children,
}: HubLinkProps) {
  return (
    <a
      href={hubUrl(path, campaign, content)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
