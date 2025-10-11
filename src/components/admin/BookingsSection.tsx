import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Mail,
  Phone,
  Users,
  CheckCircle,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { BookingStatus } from "@prisma/client";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  allergies?: string | null;
}

interface Service {
  id: string;
  name: string;
  description?: string | null;
}

interface Booking {
  id: string;
  date: Date;
  startTime: Date;
  status: BookingStatus;
  notes?: string | null;
  patient: Patient;
  service: Service;
}

interface BookingsSectionProps {
  bookings: Booking[] | undefined;
  onAddBooking: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  expandedBooking: string | null;
  setExpandedBooking: (id: string | null) => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onViewPatient: (patientId: string) => void;
  getStatusBadge: (status: BookingStatus) => {
    label: string;
    icon: typeof CheckCircle;
    bg: string;
    text: string;
    border: string;
  };
  getAvatarColor: (name: string) => string;
}

export function BookingsSection({
  bookings,
  onAddBooking,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  expandedBooking,
  setExpandedBooking,
  onUpdateStatus,
  onViewPatient,
  getStatusBadge,
  getAvatarColor,
}: BookingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="mb-6 flex items-center justify-end">
        <Button
          onClick={onAddBooking}
          className="gap-2 shadow-lg hover:shadow-xl transition-all"
          style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
        >
          <Plus className="h-5 w-5" />
          حجز جديد
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
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

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">تصفية النتائج</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Status Filter */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">الحالة</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع الحجوزات</SelectItem>
                  <SelectItem value="PENDING">قيد الانتظار</SelectItem>
                  <SelectItem value="CONFIRMED">مؤكدة</SelectItem>
                  <SelectItem value="COMPLETED">مكتملة</SelectItem>
                  <SelectItem value="CANCELLED">ملغية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-xs text-gray-600 mb-1 block">التاريخ</label>
              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value);
                  if (value !== "CUSTOM") {
                    setDateFrom("");
                    setDateTo("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="تصفية حسب التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع التواريخ</SelectItem>
                  <SelectItem value="TODAY">اليوم</SelectItem>
                  <SelectItem value="THIS_WEEK">هذا الأسبوع</SelectItem>
                  <SelectItem value="THIS_MONTH">هذا الشهر</SelectItem>
                  <SelectItem value="CUSTOM">نطاق مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === "CUSTOM" && (
              <>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">من تاريخ</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">إلى تاريخ</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </>
            )}
          </div>

          {/* Clear Filters Button */}
          {(statusFilter !== "ALL" || dateFilter !== "ALL" || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setStatusFilter("ALL");
                  setDateFilter("ALL");
                  setSearchQuery("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="w-full text-sm"
              >
                مسح جميع الفلاتر
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bookings Cards */}
      {bookings && bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const statusBadge = getStatusBadge(booking.status);
            const StatusIcon = statusBadge.icon;
            const isExpanded = expandedBooking === booking.id;
            const avatarColor = getAvatarColor(booking.patient.firstName);

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Main Card Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Patient Info */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar */}
                      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${avatarColor} text-white text-xl font-bold shadow-lg flex-shrink-0`}>
                        {booking.patient.firstName.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-primary mb-1 truncate">
                          {booking.patient.firstName} {booking.patient.lastName}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            {booking.patient.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {booking.patient.phone}
                          </span>
                        </div>
                        {booking.patient.allergies && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 rounded-lg px-2 py-1 inline-flex">
                            ⚠️ حساسية: {booking.patient.allergies}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 rounded-full ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border} px-4 py-2 text-sm font-semibold whitespace-nowrap`}>
                      <StatusIcon className="h-4 w-4" />
                      {statusBadge.label}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="mt-4 grid gap-4 md:grid-cols-3 bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">الخدمة</p>
                      <p className="font-semibold text-gray-900">{booking.service.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">التاريخ</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(booking.date), "dd MMMM yyyy", { locale: ar })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">الوقت</p>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(booking.startTime), "h:mm a", { locale: ar })}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewPatient(booking.patient.id)}
                      className="gap-2 flex-1 sm:flex-none"
                    >
                      <Users className="h-4 w-4" />
                      عرض السجل الطبي
                    </Button>

                    {booking.status === "PENDING" && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(booking.id, "CONFIRMED")}
                        className="gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4" />
                        تأكيد الحجز
                      </Button>
                    )}

                    {booking.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        onClick={() => onUpdateStatus(booking.id, "COMPLETED")}
                        className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-1 sm:flex-none"
                      >
                        <CheckCircle className="h-4 w-4" />
                        إكمال الزيارة
                      </Button>
                    )}

                    <button
                      onClick={() =>
                        setExpandedBooking(isExpanded ? null : booking.id)
                      }
                      className="flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors px-3 py-2 rounded-lg hover:bg-accent-light"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          إخفاء التفاصيل
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          المزيد من التفاصيل
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-gray-100"
                    >
                      <div className="p-6 bg-gradient-to-br from-accent-light to-white space-y-4">
                        {booking.notes && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              ملاحظات المريض
                            </p>
                            <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200">
                              {booking.notes}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">تغيير حالة الحجز</p>
                          <Select
                            value={booking.status}
                            onValueChange={(value) =>
                              onUpdateStatus(booking.id, value as BookingStatus)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">قيد الانتظار</SelectItem>
                              <SelectItem value="CONFIRMED">مؤكد</SelectItem>
                              <SelectItem value="COMPLETED">مكتمل</SelectItem>
                              <SelectItem value="CANCELLED">ملغي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-lg border border-gray-100">
          <Calendar className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-600 mb-2">
            {searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL"
              ? "لا توجد نتائج مطابقة للبحث"
              : "لا توجد حجوزات حالياً"}
          </p>
          <p className="text-sm text-gray-500">
            {searchQuery || statusFilter !== "ALL" || dateFilter !== "ALL"
              ? "جرب تغيير معايير البحث أو التصفية"
              : "الحجوزات الجديدة ستظهر هنا"}
          </p>
        </div>
      )}
    </motion.div>
  );
}
