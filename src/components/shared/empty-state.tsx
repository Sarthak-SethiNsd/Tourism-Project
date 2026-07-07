import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  className?: string;
};

export function EmptyState({ title, description, actionLabel, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed bg-card p-6 text-center", className)}>
      <SearchX className="mb-4 size-8 text-muted-foreground" aria-hidden />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
      {actionLabel ? <Button className="mt-5">{actionLabel}</Button> : null}
    </div>
  );
}
