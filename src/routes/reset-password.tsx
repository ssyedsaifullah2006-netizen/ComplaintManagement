import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resetPasswordSchema } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset Password — CCMS", "Choose a new password for your account."),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        setHasRecoverySession(!!session);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: sessionData, error }) => {
      if (!active) return;
      if (error) {
        toast.error(error.message);
        setHasRecoverySession(false);
      } else {
        setHasRecoverySession(!!sessionData.session);
      }
      setChecking(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        nextErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Your password has been updated.");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">CCMS</h1>
            <p className="text-sm text-muted-foreground">
              Campus Complaint &amp; Maintenance System
            </p>
          </div>
        </div>
        <h2 className="text-xl font-semibold">Set a new password</h2>
        {checking ? (
          <p role="status" className="mt-3 text-sm text-muted-foreground">
            Verifying your reset link…
          </p>
        ) : !hasRecoverySession ? (
          <div className="mt-3 space-y-5">
            <p role="alert" className="text-sm text-muted-foreground">
              This password reset link is invalid or has expired. Request a new link to continue.
            </p>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request another reset link</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={!!errors["password"]}
                aria-describedby={errors["password"] ? "new-password-error" : undefined}
              />
              {errors["password"] && (
                <p id="new-password-error" role="alert" className="text-xs text-destructive">
                  {errors["password"]}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                aria-invalid={!!errors["confirmPassword"]}
                aria-describedby={errors["confirmPassword"] ? "confirm-password-error" : undefined}
              />
              {errors["confirmPassword"] && (
                <p id="confirm-password-error" role="alert" className="text-xs text-destructive">
                  {errors["confirmPassword"]}
                </p>
              )}
            </div>
            <Button className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              Update password
            </Button>
          </form>
        )}
        {!checking && (
          <Button asChild variant="ghost" className="mt-3 w-full">
            <Link to="/auth">
              <ArrowLeft /> Back to sign in
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
