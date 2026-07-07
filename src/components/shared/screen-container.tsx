import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ScreenContainerProps = ComponentProps<"section">;

export function ScreenContainer({ className, children, ...props }: ScreenContainerProps) {
  return (
    <section className={cn("mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-6 sm:max-w-lg sm:px-6", className)} {...props}>
      {children}
    </section>
  );
}
