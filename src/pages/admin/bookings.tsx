import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Calendar,
  CheckCircle,
  Clock,
  X,
} from "lucide-react";
import { AdminLayout } from "~/components/admin/AdminLayout";
import { BookingsSection } from "~/components/admin/BookingsSection";
import { BookingWizard } from "~/components/admin/BookingWizard";
import { api } from "~/utils/api";
import { useNotification } from "~/components/NotificationProvider";
import { BookingStatus } from "@prisma/client";

// Helper function to get status badge styling
const getStatusBadge = (status: BookingStatus) => {
  const badges = {
    PENDING: {
      label: "قيد الانتظار",
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Clock,
    },
    CONFIRMED: {
      label: "مؤكد",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "ملغي",
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
      icon: X,
    },
    COMPLETED: {
      label: "مكتمل",
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: CheckCircle,
    },
  };
  return badges[status];
};

// Helper function to get patient avatar color
const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500",
    "bg-gradient-to-br from-green-500 to-emerald-500",
    "bg-gradient-to-br from-orange-500 to-yellow-500",
    "bg-gradient-to-br from-red-500 to-pink-500",
    "bg-gradient-to-br from-indigo-500 to-purple-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] ?? colors[0]!;
};

export default function BookingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const notification = useNotification();

  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [newBooking, setNewBooking] = useState({
    serviceId: "",
    city: "",
    date: "",
    time: "",
    notes: "",
  });

  // Queries - must be called before any conditional returns
  const { data: bookings, refetch: refetchBookings } =
    api.admin.getAllBookings.useQuery(undefined, {
      enabled: status === "authenticated",
    });
  const { data: services } = api.admin.getAllServices.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const { data: searchResults } = api.admin.searchPatients.useQuery(
    { query: patientSearchQuery },
    { enabled: patientSearchQuery.length > 0 && status === "authenticated" }
  );

  // Mutations
  const updateBookingStatus = api.admin.updateBookingStatus.useMutation({
    onSuccess: () => {
      notification.success("تم تحديث حالة الحجز");
      void refetchBookings();
    },
    onError: () => notification.error("فشل في تحديث الحالة"),
  });

  const createPatient = api.admin.createPatient.useMutation({
    onSuccess: (patient) => {
      notification.success("تم إضافة المريض بنجاح");
      setSelectedPatient(patient.id);
      setBookingStep(2);
      setNewPatient({ firstName: "", lastName: "", email: "", phone: "" });
    },
    onError: () => notification.error("فشل في إضافة المريض"),
  });

  const createBookingForPatient = api.admin.createBookingForPatient.useMutation({
    onSuccess: () => {
      notification.success("تم إضافة الحجز بنجاح");
      void refetchBookings();
      setShowBookingWizard(false);
      setBookingStep(1);
      setSelectedPatient(null);
      setPatientSearchQuery("");
      setNewBooking({ serviceId: "", city: "", date: "", time: "", notes: "" });
    },
    onError: (error) => notification.error(error.message || "فشل في إضافة الحجز"),
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

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    createPatient.mutate(newPatient);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !newBooking.serviceId || !newBooking.date || !newBooking.time) {
      notification.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const [hours, minutes] = newBooking.time.split(":").map(Number);
    const bookingDate = new Date(newBooking.date);
    const startTime = new Date(newBooking.date);
    startTime.setHours(hours!, minutes!);

    createBookingForPatient.mutate({
      patientId: selectedPatient,
      serviceId: newBooking.serviceId,
      city: newBooking.city,
      date: bookingDate,
      startTime,
      notes: newBooking.notes || undefined,
    });
  };

  // Filter bookings based on search, status, and date
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      const matchesSearch =
        searchQuery === "" ||
        booking.patient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patient.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.patient.phone?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "ALL") {
        const bookingDate = new Date(booking.date);
        bookingDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (dateFilter === "TODAY") {
          matchesDate = bookingDate.getTime() === today.getTime();
        } else if (dateFilter === "THIS_WEEK") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDate = bookingDate >= weekStart && bookingDate <= weekEnd;
        } else if (dateFilter === "THIS_MONTH") {
          matchesDate =
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear();
        } else if (dateFilter === "CUSTOM" && dateFrom && dateTo) {
          const fromDate = new Date(dateFrom);
          fromDate.setHours(0, 0, 0, 0);
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          matchesDate = bookingDate >= fromDate && bookingDate <= toDate;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, dateFilter, dateFrom, dateTo]);

  return (
    <>
      <Head>
        <title>إدارة الحجوزات - عيادات د. محمد حماد</title>
      </Head>

      <AdminLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">إدارة الحجوزات</h1>
            <p className="text-lg text-gray-600">إدارة ومتابعة حجوزات المرضى</p>
          </div>

          <BookingsSection
            bookings={filteredBookings}
            onAddBooking={() => setShowBookingWizard(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            expandedBooking={expandedBooking}
            setExpandedBooking={setExpandedBooking}
            onUpdateStatus={(id, status) => updateBookingStatus.mutate({ id, status })}
            onViewPatient={(patientId) => router.push(`/admin/patient/${patientId}`)}
            getStatusBadge={getStatusBadge}
            getAvatarColor={getAvatarColor}
          />
        </div>

        <BookingWizard
          show={showBookingWizard}
          onClose={() => setShowBookingWizard(false)}
          services={services}
          searchResults={searchResults}
          patientSearchQuery={patientSearchQuery}
          setPatientSearchQuery={setPatientSearchQuery}
          newPatient={newPatient}
          setNewPatient={setNewPatient}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          onCreatePatient={handleCreatePatient}
          onCreateBooking={handleCreateBooking}
          bookingStep={bookingStep}
          setBookingStep={setBookingStep}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
        />
      </AdminLayout>
    </>
  );
}
