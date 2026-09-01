"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";

export function BackToExploreButton() {
  const router = useRouter();

  function handleBack() {
    const cameFromThisApp = document.referrer.startsWith(window.location.origin);

    if (cameFromThisApp && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(routes.explore);
  }

  return (
    <Button type="button" variant="ghost" className="w-fit rounded-lg" onClick={handleBack}>
      <ArrowLeft className="size-4" aria-hidden />
      Back to Explore
    </Button>
  );
}
