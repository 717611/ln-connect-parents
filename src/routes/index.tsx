import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, KeyRound, Loader2, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ASSETS } from "@/assets";
import { PublicRoute } from "@/components/guards/PublicRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_CONFIG } from "@/constants/config";
import { LABELS } from "@/constants/labels";
import { ROUTES } from "@/constants/routes";
import { MOTION } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

const loginSchema = z.object({
  admissionNumber: z.string().trim().min(4, "Enter a valid admission number"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Login | LN Parent Portal — LN International School" },
      {
        name: "description",
        content:
          "Sign in to the LN International School Parent Portal to follow homework, classwork, notices and school updates for your child.",
      },
      { property: "og:title", content: "Login | LN Parent Portal — LN International School" },
      {
        property: "og:description",
        content: "Sign in to the LN International School Parent Portal to follow homework, classwork, notices and school updates for your child.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <PublicRoute>
      <LoginScreen />
    </PublicRoute>
  );
}

function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { admissionNumber: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values);
      await navigate({ to: ROUTES.home, replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in right now.");
    }
  };

  const onForgotPassword = async () => {
    const admissionNumber = form.getValues("admissionNumber");
    if (!admissionNumber.trim()) {
      form.setError("admissionNumber", { message: "Enter your admission number first" });
      return;
    }
    try {
      await authService.requestPasswordReset(admissionNumber);
      toast.success("The school office will help you reset your password.");
    } catch {
      toast.error("Could not raise a reset request. Please contact the school office.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="relative min-h-screen overflow-hidden bg-secondary">
      <img
        src={ASSETS.loginSchool}
        alt=""
        aria-hidden="true"
        width={1122}
        height={1402}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full scale-105 object-cover object-center blur-[1px] brightness-[1.45] saturate-[0.9]"
      />
      <div className="absolute inset-0 bg-secondary/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-secondary/45 to-secondary/90" />



      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 pb-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: MOTION.ease }}
          className="text-center"
        >
          <img
            src={ASSETS.lnLogo}
            alt="LN International School crest"
            width={96}
            height={96}
            className="mx-auto size-20 object-contain drop-shadow-lg"
          />
          <h1 className="mt-5 font-display text-2xl font-semibold text-secondary-foreground">
            {LABELS.brand.school}
          </h1>
          <p className="mt-1 font-display text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {LABELS.brand.module}
          </p>
          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-secondary-foreground/75">
            {LABELS.brand.tagline}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.slow, ease: MOTION.ease, delay: 0.08 }}
          className="mt-10 rounded-3xl bg-card p-6 shadow-[var(--shadow-raised)]"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="admissionNumber" className="text-xs font-semibold text-muted-foreground">
                {LABELS.login.admissionNumber}
              </Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admissionNumber"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder={LABELS.login.admissionPlaceholder}
                  className="h-12 rounded-2xl border-border bg-background pl-10 text-sm"
                  {...form.register("admissionNumber")}
                />
              </div>
              {form.formState.errors.admissionNumber ? (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.admissionNumber.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground">
                {LABELS.login.password}
              </Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={LABELS.login.passwordPlaceholder}
                  className="h-12 rounded-2xl border-border bg-background pl-10 pr-11 text-sm"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-semibold text-accent transition-opacity hover:opacity-75"
              >
                {LABELS.login.forgotPassword}
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:bg-primary/90 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {LABELS.login.submitting}
                </>
              ) : (
                LABELS.login.submit
              )}
            </Button>

            <p className="pt-1 text-center text-xs text-muted-foreground">{LABELS.login.helper}</p>
          </form>
        </motion.div>

        <p className="mt-auto pt-8 text-center text-[11px] text-secondary-foreground/50">
          Version {APP_CONFIG.version}
        </p>
      </div>
    </div>
  );
}
