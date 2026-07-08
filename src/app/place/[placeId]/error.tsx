"use client";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 pt-20">
        <ErrorState title="Place details could not load" description="Please try again in a moment." />
        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </main>
    </AppShell>
  );
}
