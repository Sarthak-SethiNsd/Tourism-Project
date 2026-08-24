"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { ScreenContainer } from "@/components/shared/screen-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/config/routes";
import { signInWithEmail, signUpWithEmail } from "@/features/authentication/services/authentication-service";

export type AuthenticationMode = "signin" | "signup";

type AuthenticationExperienceProps = {
  initialMode: AuthenticationMode;
};

export function AuthenticationExperience({ initialMode }: AuthenticationExperienceProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthenticationMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "signup";

  function switchMode(nextMode: AuthenticationMode) {
    setMode(nextMode);
    setErrorMessage(null);
    router.replace(`${routes.login}?mode=${nextMode}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setErrorMessage("Enter your email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(normalizedEmail, password);
      } else {
        await signInWithEmail(normalizedEmail, password);
      }

      router.replace(`${routes.home}?step=state`);
    } catch (error) {
      setErrorMessage(getAuthenticationErrorMessage(error, mode));
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-background">
      <ScreenContainer className="justify-center gap-6">
        <div>
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{isSignUp ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {isSignUp ? "Create an account to keep your travel plans connected." : "Sign in to continue with your travel profile."}
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="mb-5 grid grid-cols-2 gap-2" role="tablist" aria-label="Authentication mode">
              <Button type="button" variant={mode === "signin" ? "default" : "secondary"} disabled={isSubmitting} onClick={() => switchMode("signin")} role="tab" aria-selected={mode === "signin"}>
                Sign In
              </Button>
              <Button type="button" variant={mode === "signup" ? "default" : "secondary"} disabled={isSubmitting} onClick={() => switchMode("signup")} role="tab" aria-selected={mode === "signup"}>
                Sign Up
              </Button>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" autoComplete="email" value={email} disabled={isSubmitting} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} value={password} disabled={isSubmitting} onChange={(event) => setPassword(event.target.value)} required minLength={6} />
              </div>
              {isSignUp ? (
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} disabled={isSubmitting} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={6} />
                </div>
              ) : null}

              {errorMessage ? (
                <Alert variant="destructive">
                  <AlertCircle aria-hidden />
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              ) : null}

              <Button type="submit" className="min-h-12" disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : null}
                {isSubmitting ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button type="button" variant="ghost" disabled={isSubmitting} onClick={() => router.push(routes.home)}>
          Continue as guest
        </Button>
      </ScreenContainer>
    </main>
  );
}

function getAuthenticationErrorMessage(error: unknown, mode: AuthenticationMode) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";

  if (code === "auth/email-already-in-use") return "An account already exists for this email address.";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") return "Email or password is incorrect.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (code === "auth/weak-password") return "Choose a stronger password.";
  if (code === "auth/operation-not-allowed") return "Email/password authentication is not enabled for this Firebase project.";

  return mode === "signup" ? "Your account could not be created. Please try again." : "Sign-in could not be completed. Please try again.";
}
