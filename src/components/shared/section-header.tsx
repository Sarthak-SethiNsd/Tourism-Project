import { Badge } from "@/components/ui/badge";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <Badge variant="secondary" className="w-fit">
        {eyebrow}
      </Badge>
      <div className="max-w-2xl space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {description ? <p className="text-sm leading-6 text-muted-foreground sm:text-base">{description}</p> : null}
      </div>
    </div>
  );
}
