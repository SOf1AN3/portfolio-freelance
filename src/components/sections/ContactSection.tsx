"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/animations/Reveal";
import { Stagger, StaggerItem } from "@/components/animations/Stagger";
import {
  whatsappLink,
  WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_MESSAGE,
} from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/contact";
import { WhatsappIcon } from "@/components/icons/WhatsappIcon";

type ProjectType = "web" | "mobile" | "saas" | "refonte";
type Budget = "lt50k" | "50k-150k" | "150k-300k" | "undecided";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  projectType: "" | ProjectType;
  budget: "" | Budget;
  description: string;
  company: string;
};

export function ContactSection() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const projectTypes = t.raw("form.projectTypes") as Record<string, string>;
  const budgets = t.raw("form.budgets") as Record<string, string>;

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t("form.errors.name")),
        email: z.string().trim().email(t("form.errors.email")),
        phone: z
          .string()
          .refine(
            (v) => !v || /^[\d\s+\-()]{8,20}$/.test(v),
            t("form.errors.phone"),
          ),
        projectType: z
          .union([
            z.literal("web"),
            z.literal("mobile"),
            z.literal("saas"),
            z.literal("refonte"),
            z.literal(""),
          ])
          .refine((v) => v !== "", { message: t("form.errors.projectType") }),
        budget: z
          .union([
            z.literal("lt50k"),
            z.literal("50k-150k"),
            z.literal("150k-300k"),
            z.literal("undecided"),
            z.literal(""),
          ])
          .refine((v) => v !== "", { message: t("form.errors.budget") }),
        description: z
          .string()
          .trim()
          .min(10, t("form.errors.description")),
        // Honeypot kept in the schema so the value survives validation.
        company: z.string(),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      description: "",
      company: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          projectType: values.projectType,
          budget: values.budget,
          description: values.description,
          company: values.company,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        mailto?: string;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        console.error("Contact submit failed:", data.error || res.status);
        setSubmitError(t("form.error"));
        return;
      }

      setSubmitted(true);
      reset({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        description: "",
        company: "",
      });

      if (data.mailto) {
        window.setTimeout(() => {
          window.location.href = data.mailto as string;
        }, 100);
      }

      window.setTimeout(() => setSubmitted(false), 8000);
    } catch (error) {
      console.error("Contact submit error:", error);
      setSubmitError(t("form.error"));
    }
  }

  return (
    <section id="contact" className="scroll-mt-16 bg-canvas py-24 lg:py-32">
      <Container>
        <SectionHeader
          index={t("index")}
          title={t("title")}
          lead={t("subtitle")}
        />

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-12">
          {/* Formulaire — colonne large (7/12) */}
          <Reveal className="min-w-0 lg:col-span-7">
            <div className="rounded-md border border-hairline bg-card p-8 sm:p-10">
              <div aria-live="polite" aria-atomic="true">
                {submitted && (
                  <div className="mb-6 rounded-md border border-emerald/30 bg-emerald/10 px-4 py-3 font-mono text-xs text-emerald">
                    {t("form.success")}
                  </div>
                )}

                {submitError && (
                  <div
                    role="alert"
                    className="mb-6 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 font-mono text-xs text-danger"
                  >
                    {submitError}
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative space-y-6"
                noValidate
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("form.name")}</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      placeholder="John Doe"
                      aria-invalid={Boolean(formErrors.name)}
                      aria-describedby={
                        formErrors.name ? "name-error" : undefined
                      }
                      {...register("name")}
                    />
                    {formErrors.name && (
                      <p
                        id="name-error"
                        className="font-mono text-xs text-danger"
                      >
                        {formErrors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("form.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(formErrors.email)}
                      aria-describedby={
                        formErrors.email ? "email-error" : undefined
                      }
                      {...register("email")}
                    />
                    {formErrors.email && (
                      <p
                        id="email-error"
                        className="font-mono text-xs text-danger"
                      >
                        {formErrors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("form.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+213 555 00 00 00"
                      aria-invalid={Boolean(formErrors.phone)}
                      aria-describedby={
                        formErrors.phone ? "phone-error" : undefined
                      }
                      {...register("phone")}
                    />
                    {formErrors.phone && (
                      <p
                        id="phone-error"
                        className="font-mono text-xs text-danger"
                      >
                        {formErrors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectType">{t("form.projectType")}</Label>
                    <Controller
                      control={control}
                      name="projectType"
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="projectType"
                            aria-label={t("form.projectType")}
                            aria-invalid={Boolean(formErrors.projectType)}
                            aria-describedby={
                              formErrors.projectType
                                ? "projectType-error"
                                : undefined
                            }
                            className="w-full"
                          >
                            <SelectValue placeholder={t("form.projectType")} />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.entries(projectTypes) as [
                                ProjectType,
                                string,
                              ][]
                            ).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {formErrors.projectType && (
                      <p
                        id="projectType-error"
                        className="font-mono text-xs text-danger"
                      >
                        {formErrors.projectType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">{t("form.budget")}</Label>
                  <Controller
                    control={control}
                    name="budget"
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="budget"
                          aria-label={t("form.budget")}
                          aria-invalid={Boolean(formErrors.budget)}
                          aria-describedby={
                            formErrors.budget ? "budget-error" : undefined
                          }
                          className="w-full"
                        >
                          <SelectValue placeholder={t("form.budget")} />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(budgets) as [Budget, string][]).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {formErrors.budget && (
                    <p
                      id="budget-error"
                      className="font-mono text-xs text-danger"
                    >
                      {formErrors.budget.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t("form.description")}</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="..."
                    className="resize-none"
                    aria-invalid={Boolean(formErrors.description)}
                    aria-describedby={
                      formErrors.description ? "description-error" : undefined
                    }
                    {...register("description")}
                  />
                  {formErrors.description && (
                    <p
                      id="description-error"
                      className="font-mono text-xs text-danger"
                    >
                      {formErrors.description.message}
                    </p>
                  )}
                </div>

                <div
                  aria-hidden="true"
                  className="absolute top-auto h-px w-px overflow-hidden [inset-inline-start:-9999px]"
                >
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("company")}
                  />
                </div>

                <div className="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-fog">
                    {t("form.privacyNote")}
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    className="group gap-2.5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="size-4 rtl:rotate-180 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        {t("form.submit")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>

          {/* Canaux directs — colonne étroite (5/12) */}
          <Reveal
            delay={0.12}
            className="flex min-w-0 flex-col gap-6 lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-md border border-emerald/30 bg-card p-8">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-20 -end-20 size-56 rounded-full bg-emerald/10 blur-3xl"
              />

              <div className="relative flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald/15 text-emerald">
                      <WhatsappIcon className="size-5" />
                    </span>
                    <h3 className="font-display text-xl font-semibold leading-snug text-platinum">
                      {t("whatsappCard.title")}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-mist">
                    {t("whatsappCard.description")}
                  </p>
                </div>

                <Button
                  asChild
                  variant="whatsapp"
                  size="lg"
                  className="w-full gap-3"
                >
                  <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon className="size-4" />
                    {t("whatsappCard.cta")}
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-md border border-hairline bg-card p-8">
              <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-fog">
                {t("coordinates.label")}
              </span>

              <Stagger className="mt-5 flex flex-col gap-4" stagger={0.08}>
                <StaggerItem>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline pb-3 font-mono text-sm">
                    <span className="text-fog">{t("info.email")}</span>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all text-platinum transition-colors hover:text-emerald"
                    >
                      {t("coordinates.email")}
                    </a>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline pb-3 font-mono text-sm">
                    <span className="text-fog">{t("info.phone")}</span>
                    <a
                      href={`tel:+${WHATSAPP_NUMBER}`}
                      dir="ltr"
                      className="text-platinum transition-colors hover:text-emerald"
                    >
                      {t("coordinates.phone")}
                    </a>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-sm">
                    <span className="text-fog">{t("info.location")}</span>
                    <span className="text-platinum">
                      {t("coordinates.reach")}
                    </span>
                  </div>
                </StaggerItem>
              </Stagger>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
