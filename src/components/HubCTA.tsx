import { hubUrl } from "@/lib/hub";

interface HubCTAProps {
  headline?: string;
  subtext?: string;
  buttonText?: string;
  campaign?: string;
  content?: string;
}

export function HubCTA({
  headline = "Ready to find your next game?",
  subtext = "Join 2,000+ pickleball players in Montgomery County. Get matched with players at your level, discover groups, and never miss an event.",
  buttonText = "Join the Community",
  campaign = "hub_cta",
  content = "inline_banner",
}: HubCTAProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-court-green to-teal rounded-2xl p-10 md:p-14">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
          {headline}
        </h2>
        <p className="text-green-100 mb-8 max-w-lg mx-auto">
          {subtext}
        </p>
        <a
          href={hubUrl("/", campaign, content)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hub inline-block px-8 py-3.5 rounded-xl text-base font-bold shadow-lg"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
