"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, MessageCircle, Mail, MapPin, Loader2 } from "lucide-react";

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

type ProjectType = "web" | "mobile" | "saas" | "refonte";
type Budget = "lt50k" | "50k-150k" | "150k-300k" | "undecided";

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  projectType: ProjectType;
  budget: Budget;
  description: string;
};

export function ContactSection() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = React.useState(false);

  const errors = t.raw("form.errors") as Record<string, string>;
  const projectTypes = t.raw("form.projectTypes") as Record<string, string>;
  const budgets = t.raw("form.budgets") as Record<string, string>;

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(2, errors.name),
        email: z.string().email(errors.email),
        phone: z
          .string()
          .optional()
          .refine(
            (v) => !v || /^[\d\s+\-()]{8,20}$/.test(v),
            errors.phone,
          ),
        projectType: z.enum(["web", "mobile", "saas", "refonte"], {
          message: errors.projectType,
        }),
        budget: z.enum(
          ["lt50k", "50k-150k", "150k-300k", "undecided"],
          { message: errors.budget },
        ),
        description: z.string().min(10, errors.description),
      }),
    [errors],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: formErrors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: undefined,
      budget: undefined,
      description: "",
    },
  });

  const projectTypeValue = watch("projectType");
  const budgetValue = watch("budget");

  async function onSubmit(values: FormValues) {
    // Simulated submit — integrate with email API / Formspree / WhatsApp redirect as needed
    await new Promise((r) => setTimeout(r, 800));
    console.log("Quote request:", values);
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 6000);
  }

  return (
    <section id="contact" className="scroll-mt-20 py-20 lg:py-28">
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
            className="lg:col-span-3"
          >
            <Card className="h-full border-border/60 bg-card/80 backdrop-blur">
              <CardContent className="p-6 sm:p-8">
                {submitted && (
                  <div className="mb-6 rounded-lg border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#22c55e]">
                    {t("form.success")}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("form.name")}</Label>
                      <Input
                        id="name"
                        autoComplete="name"
                        placeholder="John Doe"
                        {...register("name")}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive">
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
                        {...register("email")}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive">
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
                        {...register("phone")}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-destructive">
                          {formErrors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>{t("form.projectType")}</Label>
                      <Select
                        value={projectTypeValue}
                        onValueChange={(v) =>
                          setValue("projectType", v as ProjectType, {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger aria-label={t("form.projectType")}>
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
                      {formErrors.projectType && (
                        <p className="text-xs text-destructive">
                          {formErrors.projectType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("form.budget")}</Label>
                    <Select
                      value={budgetValue}
                      onValueChange={(v) =>
                        setValue("budget", v as Budget, {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger aria-label={t("form.budget")}>
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
                    {formErrors.budget && (
                      <p className="text-xs text-destructive">
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
                      {...register("description")}
                    />
                    {formErrors.description && (
                      <p className="text-xs text-destructive">
                        {formErrors.description.message}
                      </p>
                    )}
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
            className="flex flex-col gap-6 lg:col-span-2"
          >
            <Card className="relative overflow-hidden border-[#22c55e]/30 bg-gradient-to-br from-[#22c55e]/10 via-card to-card">
              <CardContent className="p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#22c55e]">
                  <MessageCircle className="size-6" />
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
                    <MessageCircle className="size-4" />
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
                      contact@sofianeasma.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#22c55e]/10 text-[#22c55e]">
                    <MessageCircle className="size-4" />
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
