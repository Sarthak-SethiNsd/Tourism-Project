"use client";

import { MotionConfig } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";

function AuthStateListener() {
  useAuthUser();
  return null;
}

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MotionConfig reducedMotion="user">
      <AuthStateListener />
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </MotionConfig>
  );
}
