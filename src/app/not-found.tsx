import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5">
      <EmptyState title="Route not found" description="This destination has not been added to the platform yet." />
      <Button asChild className="mt-5">
        <Link href="/">Return home</Link>
      </Button>
    </main>
  );
}
