export const CONTACT_EMAIL = "contact@sofianeasma.me";

export function mailtoLink({
  subject,
  body,
}: {
  subject: string;
  body: string;
}) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
