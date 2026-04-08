import { BusinessCTA } from "@/components/BusinessCTA";

interface HubCTAProps {
  headline?: string;
  subtext?: string;
  buttonText?: string;
  campaign?: string;
  content?: string;
}

export function HubCTA({
  campaign = "hub_cta",
  ...props
}: HubCTAProps) {
  return <BusinessCTA business="hub" campaign={campaign} {...props} />;
}
