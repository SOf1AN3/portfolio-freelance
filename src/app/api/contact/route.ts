import { NextResponse } from "next/server";
import { CONTACT_EMAIL, mailtoLink } from "@/lib/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  description: 5000,
  projectType: 20,
  budget: 20,
} as const;

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  description?: string;
  company?: string;
};

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request), {
    limit: 5,
    windowMs: 60_000,
  });

  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: silently pretend success so bots do not learn they were filtered.
  if (body.company) {
    return NextResponse.json({ ok: true, via: "ignored" });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const projectType = (body.projectType ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const description = (body.description ?? "").trim();

  if (
    !name ||
    !email ||
    description.length < 10 ||
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    projectType.length > LIMITS.projectType ||
    budget.length > LIMITS.budget ||
    description.length > LIMITS.description ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const lines = [
    `Nom: ${name}`,
    `Email: ${email}`,
    phone ? `Téléphone: ${phone}` : null,
    projectType ? `Type de projet: ${projectType}` : null,
    budget ? `Budget: ${budget}` : null,
    "",
    "Description:",
    description,
  ].filter((line): line is string => line !== null);

  const mailto = mailtoLink({
    subject: `Demande de devis — ${name}`,
    body: lines.join("\n"),
  });

  // SMTP optional: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.
  // SMTP_FROM is mandatory: the sender must never be the visitor's address.
  const smtpHost = process.env.SMTP_HOST;
  const smtpFrom = process.env.SMTP_FROM;

  if (smtpHost && smtpFrom) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `Demande de devis — ${name}`,
        text: lines.join("\n"),
      });

      return NextResponse.json({ ok: true, via: "smtp" });
    } catch (error) {
      console.error("SMTP send failed:", error);
    }
  } else if (smtpHost && !smtpFrom) {
    console.warn("SMTP_HOST is set but SMTP_FROM is missing; skipping SMTP");
  }

  return NextResponse.json({ ok: true, via: "mailto", mailto });
}