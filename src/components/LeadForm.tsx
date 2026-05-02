"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { getVisitorIdForForm } from "@/lib/funnelClient";
import { businesses } from "@/lib/businesses";
import { businessUrl } from "@/lib/tracking";

const INTEREST_OPTIONS = [
  { value: "open-play", label: "Find Open Play", businessId: "coaching" as const },
  { value: "lessons", label: "Private Lessons / Coaching", businessId: "coaching" as const },
  { value: "clinics", label: "Group Clinics", businessId: "coaching" as const },
  { value: "youth", label: "Youth / Kids Programs", businessId: "nga" as const },
  { value: "leagues", label: "Leagues & Tournaments", businessId: "tournaments" as const },
  { value: "other", label: "Something Else", businessId: "coaching" as const },
];

export function LeadForm({ heading = "What are you looking for?", page = "unknown", defaultInterest }: { heading?: string; page?: string; defaultInterest?: string }) {
  const [form, setForm] = useState({ name: "", email: "", interest: defaultInterest ?? "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formStarted = useRef(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (status === "error") setStatus("idle");
    if (!formStarted.current) {
      formStarted.current = true;
      trackEvent("lead_form", { action: "started", interest: "", page });
    }
  }

  const selectedOption = INTEREST_OPTIONS.find((o) => o.value === form.interest);
  const targetBusiness = selectedOption
    ? businesses.find((b) => b.id === selectedOption.businessId)
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          page,
          visitor_id: getVisitorIdForForm(),
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Failed to submit");
      trackEvent("lead_form", { action: "submitted", interest: form.interest, page });
      setStatus("sent");
    } catch {
      trackEvent("lead_form", { action: "error", interest: form.interest, page });
      setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  if (status === "sent" && targetBusiness) {
    const url = businessUrl(targetBusiness, "lead_form", form.interest);
    return (
      <div role="status" aria-live="polite" className="card-moco p-8 text-center max-w-lg mx-auto">
        <div className="text-court-green text-4xl mb-4">&#10003;</div>
        <h3 className="font-heading font-bold text-xl text-text-primary mb-2">You&apos;re in!</h3>
        <p className="text-text-muted mb-6">
          Based on your interest, here&apos;s where to go next:
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-hub inline-block px-8 py-3 rounded-xl text-base font-bold"
        >
          {targetBusiness.ctaText} &rarr;
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-moco p-8 max-w-lg mx-auto space-y-4"
    >
      <h3 className="font-heading font-bold text-2xl text-text-primary text-center">{heading}</h3>
      <p className="text-sm text-text-muted text-center">Tell us what you need and we&apos;ll point you in the right direction.</p>

      <input
        type="text"
        placeholder="Your name"
        aria-label="Your name"
        required
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-court-green focus:outline-none transition-colors"
      />

      <input
        type="email"
        placeholder="Your email"
        aria-label="Your email"
        required
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-court-green focus:outline-none transition-colors"
      />

      <select
        required
        aria-label="What are you looking for?"
        value={form.interest}
        onChange={(e) => updateField("interest", e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-text-primary focus:border-court-green focus:outline-none transition-colors"
      >
        <option value="" disabled>What are you looking for?</option>
        {INTEREST_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {targetBusiness && (
        <p className="text-xs text-court-green text-center">
          We&apos;ll connect you with <strong>{targetBusiness.name}</strong>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full btn-hub py-3 rounded-lg font-heading font-semibold disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Get Started"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-red-500 text-sm text-center">
          Something went wrong. Please try again.
        </p>
      )}

      <p className="text-xs text-text-muted text-center">We never share your info.</p>
    </form>
  );
}
