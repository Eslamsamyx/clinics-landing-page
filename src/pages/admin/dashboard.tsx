import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { StatsCards } from "~/components/admin/StatsCards";
import { WelcomeMessage } from "~/components/admin/WelcomeMessage";
import { BookingsChart } from "~/components/admin/BookingsChart";
import { ServicePopularityChart } from "~/components/admin/ServicePopularityChart";
import { BookingStatusChart } from "~/components/admin/BookingStatusChart";
import { PeakTimesChart } from "~/components/admin/PeakTimesChart";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { api } from "~/utils/api";

export default function AdminDashboard() {
  const { status } = useSession();
  const router = useRouter();

  // Queries - must be called before any conditional returns
  const { data: stats, isError: statsError } = api.admin.getStats.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { data: bookingsOverTime } = api.admin.getBookingsOverTime.useQuery(
    { days: 30 },
    { enabled: status === "authenticated" }
  );
  const { data: serviceStats } = api.admin.getServiceStats.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { data: statusDistribution } = api.admin.getBookingStatusDistribution.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { data: peakTimes } = api.admin.getPeakTimes.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    void router.push("/admin/login");
    return null;
  }

  // Check if user has access (redirect if not ADMIN role)
  if (statsError) {
    void router.push("/admin/bookings");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>لوحة التحكم - عيادات د. محمد حماد</title>
      </Head>

      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <WelcomeMessage />
          <StatsCards stats={stats} />

          {/* Daily Bookings Chart - Full Width */}
          <div className="mt-8">
            <BookingsChart data={bookingsOverTime} />
          </div>

          {/* Two Column Grid for Charts */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <ServicePopularityChart data={serviceStats} />
            <BookingStatusChart data={statusDistribution} />
          </div>

          {/* Peak Times Chart - Full Width */}
          <div className="mt-8">
            <PeakTimesChart data={peakTimes} />
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
