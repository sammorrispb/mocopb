"use client";
import { useState } from "react";
import { getClubBrowserClient } from "@/lib/club/supabase-browser";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = getClubBrowserClient();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/club/auth/callback` : undefined;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: redirectTo },
    });
    if (signInError) {
      setStatus("error");
      setError(signInError.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-heading font-bold text-3xl text-text-primary mb-2">Sign in</h1>
        <p className="text-text-muted mb-8">
          Enter your email — we&apos;ll send you a one-time link.
        </p>

        {status === "sent" ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
            Check <span className="font-semibold">{email}</span> for a sign-in link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-base focus:border-court-green focus:outline-none focus:ring-1 focus:ring-court-green"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-court-green px-4 py-3 font-semibold text-white hover:bg-court-green/90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
