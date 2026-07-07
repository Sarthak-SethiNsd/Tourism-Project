import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = ComponentProps<typeof Button> & {
  showIcon?: boolean;
};

export function PrimaryButton({ children, className, showIcon = true, ...props }: PrimaryButtonProps) {
  return (
    <Button
      size="lg"
      className={cn("min-h-12 justify-between gap-3 bg-accent px-5 text-accent-foreground shadow-sm hover:bg-accent/90", className)}
      {...props}
    >
      <span>{children}</span>
      {showIcon ? <ArrowRight className="size-4" aria-hidden /> : null}
    </Button>
  );
}
