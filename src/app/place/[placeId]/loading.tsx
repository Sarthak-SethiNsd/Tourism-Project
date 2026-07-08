import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/shared/loading-state";

export default function Loading() {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 pt-20 sm:px-8 lg:px-12">
        <LoadingState label="Loading place details" />
      </main>
    </AppShell>
  );
}
