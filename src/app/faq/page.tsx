import type { Metadata } from "next";
import { allFAQs, faqCategories, getFAQsByCategory } from "@/lib/faq";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HubCTA } from "@/components/HubCTA";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pickleball FAQ — Everything You Need to Know",
  description:
    "Answers to common pickleball questions: how to play, where to find courts in Montgomery County, rules, ratings, lessons, leagues, and more.",
};

export default function FAQPage() {
  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
            Pickleball FAQ
          </h1>
          <p className="text-text-muted text-lg mb-12">
            Everything you need to know about pickleball in Montgomery County.
          </p>

          {faqCategories.map((cat) => {
            const items = getFAQsByCategory(cat.id);
            return (
              <AnimateOnScroll key={cat.id}>
                <div className="mb-10">
                  <h2 className="font-heading font-semibold text-xl text-text-primary mb-4">
                    {cat.label}
                  </h2>
                  <FAQAccordion items={items} page="faq" />
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </section>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: allFAQs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
            url: `${SITE_URL}/faq`,
          }),
        }}
      />

      <HubCTA
        headline="Still have questions?"
        subtext="Join the MoCo pickleball community and ask 2,000+ local players."
        campaign="faq_cta"
        content="bottom_banner"
      />
    </>
  );
}
