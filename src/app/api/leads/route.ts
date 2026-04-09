import { NextResponse } from "next/server";
import { getWelcomeEmail } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";
import {
  ingestToOpenBrain,
  type OpenBrainBusiness,
} from "@/lib/open-brain-ingest";

const SAM_EMAIL = "sam.morris2131@gmail.com";

// Maps the mocopb form `interest` value → which business pipeline the
// lead should land in on Open Brain. Keep this in sync with INTEREST_OPTIONS
// in src/components/LeadForm.tsx.
const INTEREST_TO_BUSINESS: Record<string, OpenBrainBusiness> = {
  "open-play": "ld",
  "find-players": "ld",
  "lessons": "coaching",
  "clinics": "coaching",
  "youth": "nga",
  "leagues": "ld",
  "facility": "dd",
  "other": "mocopb",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, interest } = body;

    if (!email || !name || !interest) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Store lead in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/mocopb_leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          interest,
          source_page: body.page || "unknown",
        }),
      });

      if (!res.ok) {
        console.error("Supabase insert failed:", res.status, await res.text());
      }
    }

    // 2. Send welcome email (non-blocking — don't fail the response if email fails)
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (gmailUser && gmailPass) {
      try {
        const template = getWelcomeEmail(cleanName, interest);
        await sendEmail({
          to: cleanEmail,
          subject: template.subject,
          html: template.html,
          bcc: SAM_EMAIL,
        });
      } catch (emailErr) {
        // Log but don't fail the request — lead is already stored
        console.error("Welcome email failed:", emailErr);
      }
    } else {
      console.log("MOCOPB_LEAD (no email configured):", JSON.stringify({ name: cleanName, email: cleanEmail, interest }));
    }

    // 3. Ingest to Open Brain master CRM (fire-and-forget)
    const business = INTEREST_TO_BUSINESS[interest] ?? "mocopb";
    void ingestToOpenBrain({
      email: cleanEmail,
      name: cleanName,
      business,
      source: "mocopb_form",
      interest,
      metadata: {
        source_page: body.page || "unknown",
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

