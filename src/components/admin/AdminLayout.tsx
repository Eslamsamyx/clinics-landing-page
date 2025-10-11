import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  UserCog,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { AdminRole } from "@prisma/client";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get current admin info including role
  const { data: currentAdmin, isLoading: adminLoading } = api.admin.getCurrentAdmin.useQuery();

  // Redirect assistant away from restricted pages
  useEffect(() => {
    if (currentAdmin && currentAdmin.role === AdminRole.ASSISTANT) {
      const restrictedPaths = ['/admin/dashboard', '/admin/services', '/admin/users'];
      if (restrictedPaths.includes(router.pathname)) {
        void router.push('/admin/bookings');
      }
    }
  }, [currentAdmin, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    await router.push("/");
  };

  const allNavigation = [
    {
      name: "لوحة التحكم",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      adminOnly: false, // All can see
    },
    {
      name: "الخدمات",
      href: "/admin/services",
      icon: Stethoscope,
      adminOnly: true, // Only ADMIN
    },
    {
      name: "الحجوزات",
      href: "/admin/bookings",
      icon: Calendar,
      adminOnly: false, // All can see
    },
    {
      name: "المرضى",
      href: "/admin/patients",
      icon: Users,
      adminOnly: false, // All can see
    },
    {
      name: "المستخدمين",
      href: "/admin/users",
      icon: UserCog,
      adminOnly: true, // Only ADMIN
    },
    {
      name: "زيارة الموقع",
      href: "/",
      icon: ExternalLink,
      external: true,
      adminOnly: false,
    },
  ];

  // Filter navigation based on user role
  const navigation = currentAdmin?.role === AdminRole.ADMIN
    ? allNavigation
    : allNavigation.filter(item => !item.adminOnly);

  const isActive = (href: string) => router.pathname === href;

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-light via-white to-accent-light/50" dir="rtl">
      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-r from-primary via-primary-dark to-primary-light shadow-lg border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-base font-bold drop-shadow-lg">
                لوحة التحكم
              </h1>
              <p className="text-[10px] text-accent drop-shadow-md">
                عيادات د. نادر حماد
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-16 lg:top-0 z-50 h-[calc(100vh-4rem)] lg:h-screen w-64 border-l border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo - Only visible on desktop */}
        <div className="hidden lg:block border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-light to-primary">
              <Stethoscope className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">لوحة التحكم</h1>
              <p className="text-xs text-gray-600">عيادات د. نادر حماد</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 lg:mt-0">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = !item.external && isActive(item.href);
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
                    : item.external
                    ? "text-primary-light hover:bg-primary-light/10 border border-primary-light/30"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 right-0 w-full border-t border-gray-200 p-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
