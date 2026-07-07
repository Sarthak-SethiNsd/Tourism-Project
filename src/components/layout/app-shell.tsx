import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { TopNavigation } from "@/components/navigation/top-navigation";

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-background pb-20">
      <TopNavigation />
      {children}
      <BottomNavigation />
    </div>
  );
}
