import { NextResponse } from "next/server";
import { CONTACT_EMAIL, mailtoLink } from "@/lib/contact";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  description?: string;
};

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const description = body.description?.trim() || "";

  if (!name || !email || description.length < 10) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const lines = [
    `Nom: ${name}`,
    `Email: ${email}`,
    body.phone ? `Téléphone: ${body.phone}` : null,
    body.projectType ? `Type de projet: ${body.projectType}` : null,
    body.budget ? `Budget: ${body.budget}` : null,
    "",
    "Description:",
    description,
  ].filter((line): line is string => line !== null);

  const mailto = mailtoLink({
    subject: `Demande de devis — ${name}`,
    body: lines.join("\n"),
  });

  // SMTP optional: set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
  const smtpHost = process.env.SMTP_HOST;
  if (smtpHost) {
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
        from: process.env.SMTP_FROM || email,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `Demande de devis — ${name}`,
        text: lines.join("\n"),
      });

      return NextResponse.json({ ok: true, via: "smtp" });
    } catch (error) {
      console.error("SMTP send failed:", error);
    }
  }

  return NextResponse.json({ ok: true, via: "mailto", mailto });
}
