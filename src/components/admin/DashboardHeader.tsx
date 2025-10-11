import { LogOut, Stethoscope } from "lucide-react";
import { Button } from "~/components/ui/button";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export function DashboardHeader({ onSignOut }: DashboardHeaderProps) {
  return (
    <header className="glass-dark sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              لوحة التحكم
            </h1>
            <p className="text-sm text-accent-light">عيادات د. محمد حماد</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={onSignOut}
          className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white transition-all"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </header>
  );
}
