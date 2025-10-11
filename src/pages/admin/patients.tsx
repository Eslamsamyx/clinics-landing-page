import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  Search,
  Phone,
  Mail,
  Calendar,
  Eye,
} from "lucide-react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Helper function to get patient avatar color
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-green-500 to-emerald-500",
    "bg-gradient-to-br from-orange-500 to-yellow-500",
    "bg-gradient-to-br from-red-500 to-pink-500",
    "bg-gradient-to-br from-indigo-500 to-purple-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function PatientsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Query all bookings to extract unique patients - must be called before any conditional returns
  const { data: bookings } = api.admin.getAllBookings.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  // Extract unique patients from bookings
  const patients = bookings
    ? Array.from(
        new Map(
          bookings.map((booking) => [booking.patient.id, booking.patient])
        ).values()
      )
    : [];

  // Filter patients based on search
  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      patient.firstName.toLowerCase().includes(query) ||
      patient.lastName.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  });

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    void router.push("/admin/login");
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
        <title>إدارة المرضى - عيادات د. محمد حماد</title>
      </Head>

      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">إدارة المرضى</h1>
            <p className="text-lg text-gray-600">عرض وإدارة سجلات المرضى</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pe-10 ps-4"
              />
            </div>
          </div>

          {/* Patients Grid */}
          {filteredPatients.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient, index) => {
                const avatarColor = getAvatarColor(patient.firstName);
                const patientBookings = bookings?.filter(
                  (b) => b.patient.id === patient.id
                );

                return (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="p-6">
                      {/* Avatar and Name */}
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full ${avatarColor} text-white text-2xl font-bold shadow-lg flex-shrink-0`}
                        >
                          {patient.firstName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-primary truncate">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {patientBookings?.length || 0} حجز
                          </p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{patient.phone}</span>
                        </div>
                        {patient.dateOfBirth && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {format(new Date(patient.dateOfBirth), "dd MMMM yyyy", {
                                locale: ar,
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Alerts */}
                      {patient.allergies && (
                        <div className="mb-4 flex items-center gap-1 text-xs text-red-600 bg-red-50 rounded-lg px-2 py-2">
                          ⚠️ حساسية: {patient.allergies}
                        </div>
                      )}

                      {/* View Button */}
                      <Button
                        onClick={() => router.push(`/admin/patient/${patient.id}`)}
                        className="w-full gap-2"
                        style={{
                          background: "linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)",
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        عرض السجل الطبي
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-lg border border-gray-100">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                {searchQuery ? "لا توجد نتائج مطابقة للبحث" : "لا يوجد مرضى"}
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? "جرب تغيير معايير البحث"
                  : "المرضى سيظهرون هنا بعد إضافة حجوزات"}
              </p>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
