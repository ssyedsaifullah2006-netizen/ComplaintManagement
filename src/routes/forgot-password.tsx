import { pageHead } from "@/lib/page-head";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recoveryEmailSchema } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => pageHead("Forgot Password — CCMS", "Request a password reset email."),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);

  async function submit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    const parsed = recoveryEmailSchema.safeParse({ email: form.get("email") });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid email");
      return;
    }

    setError(undefined);
    setBusy(true);
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (requestError) {
      toast.error(requestError.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <Brand />
        <h2 className="text-xl font-semibold">Forgot your password?</h2>
        {sent ? (
          <div className="mt-3 space-y-5">
            <p role="status" className="text-sm text-muted-foreground">
              If an account exists for that email, password reset instructions have been sent. Check
              your inbox.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth">
                <ArrowLeft /> Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your account email and we’ll send you a link to reset your password.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                  id="recovery-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={!!error}
                  aria-describedby={error ? "recovery-email-error" : undefined}
                />
                {error && (
                  <p id="recovery-email-error" role="alert" className="text-xs text-destructive">
                    {error}
                  </p>
                )}
              </div>
              <Button className="w-full" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}
                Send reset link
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/auth">
                  <ArrowLeft /> Back to sign in
                </Link>
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
        <Building2 className="size-5" />
      </span>
      <div>
        <h1 className="text-2xl font-semibold">CCMS</h1>
        <p className="text-sm text-muted-foreground">Campus Complaint &amp; Maintenance System</p>
      </div>
    </div>
  );
}
