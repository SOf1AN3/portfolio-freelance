"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, MapPin, Loader2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent } from "@/components/ui/card";
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
    <section id="contact" className="scroll-mt-16 py-20 lg:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="outline" className="mb-4">
            {t("title")}
          </Badge>
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("subtitle")}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="min-w-0 lg:col-span-3"
          >
            <Card className="h-full border-border/60 bg-card/80 backdrop-blur">
              <CardContent className="p-6 sm:p-8">
                <div aria-live="polite" aria-atomic="true">
                  {submitted && (
                    <div className="mb-6 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e]">
                      {t("form.success")}
                    </div>
                  )}

                  {submitError && (
                    <div
                      role="alert"
                      className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                      {submitError}
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="relative space-y-5"
                  noValidate
                >
                  <div className="grid gap-5 sm:grid-cols-2">
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
                        <p id="name-error" className="text-xs text-destructive">
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
                        <p id="email-error" className="text-xs text-destructive">
                          {formErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
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
                        <p id="phone-error" className="text-xs text-destructive">
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
                          className="text-xs text-destructive"
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
                      <p id="budget-error" className="text-xs text-destructive">
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
                      aria-invalid={Boolean(formErrors.description)}
                      aria-describedby={
                        formErrors.description ? "description-error" : undefined
                      }
                      {...register("description")}
                    />
                    {formErrors.description && (
                      <p id="description-error" className="text-xs text-destructive">
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

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="size-4 rtl:rotate-180" />
                        {t("form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex min-w-0 flex-col gap-6 lg:col-span-2"
          >
            <Card className="relative overflow-hidden border-[#22c55e]/30 bg-gradient-to-br from-[#22c55e]/10 via-card to-card">
              <CardContent className="p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#22c55e]">
                  <WhatsappIcon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {t("whatsapp.title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("whatsapp.description")}
                </p>
                <Button asChild variant="whatsapp" size="lg" className="mt-5 w-full">
                  <a
                    href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon className="size-4" />
                    {t("whatsapp.cta")}
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("info.email")}
                    </div>
                    <div className="text-sm font-medium">
                      {CONTACT_EMAIL}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                    <WhatsappIcon className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("info.phone")}
                    </div>
                    <div className="text-sm font-medium" dir="ltr">
                      +{WHATSAPP_NUMBER}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {t("info.location")}
                    </div>
                    <div className="text-sm font-medium">
                      Algeria · Remote worldwide
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
