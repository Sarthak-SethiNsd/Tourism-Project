"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";

export default function Error({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5">
      <ErrorState description="The foundation is intact, but this view could not load." />
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
