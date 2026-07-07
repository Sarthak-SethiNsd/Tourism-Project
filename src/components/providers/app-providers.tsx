"use client";

import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </MotionConfig>
  );
}
