"use client";

import { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { TrackedExternalLink } from "@/components/TrackedExternalLink";

export interface FAQItem {
  question: string;
  answer: string;
  cta?: { text: string; href: string };
}

export function FAQAccordion({ items, page }: { items: FAQItem[]; page: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              id={`faq-q-${i}`}
              onClick={() => {
                const next = isOpen ? null : i;
                setOpenIndex(next);
                if (next !== null) {
                  trackEvent("faq_expand", { question: item.question, page });
                }
              }}
              aria-expanded={isOpen}
              aria-controls={`faq-a-${i}`}
              className="faq-button"
            >
              <span className="font-heading font-semibold text-text-primary">
                {item.question}
              </span>
              <span className="text-court-green text-xl shrink-0" aria-hidden="true">
                {isOpen ? "\u2212" : "+"}
              </span>
            </button>
            <div
              id={`faq-a-${i}`}
              role="region"
              aria-labelledby={`faq-q-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-text-muted leading-relaxed px-5 pt-3 pb-4">
                  {item.answer}
                </p>
                {item.cta && (
                  item.cta.href.startsWith("/") ? (
                    <Link
                      href={item.cta.href}
                      onClick={() => trackEvent("cta_click", { label: item.cta!.text, page, destination: "internal" })}
                      className="inline-block mx-5 mb-4 text-sm font-semibold text-court-green hover:underline"
                    >
                      {item.cta.text} &rarr;
                    </Link>
                  ) : (
                    <TrackedExternalLink
                      href={item.cta.href}
                      label={item.cta.text}
                      page={page}
                      className="inline-block mx-5 mb-4 text-sm font-semibold text-court-green hover:underline"
                    >
                      {item.cta.text} &rarr;
                    </TrackedExternalLink>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
