import type { FoundationModule } from "@/config/modules";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ModuleStatusCardProps = {
  module: FoundationModule;
};

export function ModuleStatusCard({ module }: ModuleStatusCardProps) {
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <module.icon className="size-5" aria-hidden />
          </div>
          <Badge variant={module.status === "configured" ? "default" : "secondary"}>{module.status}</Badge>
        </div>
        <h3 className="font-semibold">{module.name}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{module.description}</p>
      </CardContent>
    </Card>
  );
}
