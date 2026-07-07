"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/92 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur-xl sm:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {primaryNavigation.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-disabled={item.disabled}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.7rem] font-medium text-muted-foreground",
                active && "bg-primary/10 text-primary",
                item.disabled && "pointer-events-none opacity-55",
              )}
            >
              <item.icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
