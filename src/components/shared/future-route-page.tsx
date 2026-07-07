import Link from "next/link";
import { Compass } from "lucide-react";
import { ScreenContainer } from "@/components/shared/screen-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FutureRoutePageProps = {
  title: string;
  description: string;
};

export function FutureRoutePage({ title, description }: FutureRoutePageProps) {
  return (
    <main className="min-h-dvh bg-background">
      <ScreenContainer className="justify-center">
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="size-5" aria-hidden />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            <Button asChild className="mt-6 min-h-12 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">Back to onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </ScreenContainer>
    </main>
  );
}
