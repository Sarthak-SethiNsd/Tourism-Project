import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { appConfig } from "@/config/app";
import { secondaryNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function TopNavigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-primary/72 text-primary-foreground backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
            IN
          </span>
          <span>{appConfig.shortName}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="size-10 text-primary-foreground hover:bg-white/15" aria-label="Search">
            <Search className="size-5" aria-hidden />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="size-10 text-primary-foreground hover:bg-white/15" aria-label="Open menu">
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>{appConfig.name}</SheetTitle>
              </SheetHeader>
              <Separator className="my-5" />
              <nav className="grid gap-2">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-disabled={item.disabled}
                    className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground"
                  >
                    <item.icon className="size-4" aria-hidden />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
