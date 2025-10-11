import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  AlertTriangle,
  Users,
  PhoneCall,
  FileText,
  Stethoscope,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  Pill,
  Plus,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useNotification } from "~/components/NotificationProvider";
import { format, differenceInYears } from "date-fns";
import { ar } from "date-fns/locale";

// Helper function to get avatar color
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

// Session note form validation schema
const sessionNoteSchema = z.object({
  doctorNote: z.string().min(1, "ملاحظات الطبيب مطلوبة"),
  diagnosis: z.string().optional(),
  prescription: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.followUpRequired && !data.followUpDate) {
      return false;
    }
    return true;
  },
  {
    message: "يرجى تحديد تاريخ المتابعة",
    path: ["followUpDate"],
  }
);

type SessionNoteFormData = z.infer<typeof sessionNoteSchema>;

export default function PatientMedicalRecord() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const notification = useNotification();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedBookingForNote, setSelectedBookingForNote] = useState<{
    id: string;
    serviceName: string;
    patientName: string;
  } | null>(null);
  const [editData, setEditData] = useState({
    dateOfBirth: "",
    bloodType: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    emergencyPhone: "",
    generalNotes: "",
  });

  // Session note form
  const {
    register: registerNote,
    handleSubmit: handleSubmitNote,
    watch: watchNote,
    reset: resetNote,
    formState: { errors: noteErrors },
  } = useForm<SessionNoteFormData>({
    resolver: zodResolver(sessionNoteSchema),
    defaultValues: {
      doctorNote: "",
      diagnosis: "",
      prescription: "",
      followUpRequired: false,
      followUpDate: "",
    },
  });

  const followUpRequired = watchNote("followUpRequired");

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    void router.push("/admin/login");
    return null;
  }

  const { data: patient, refetch } = api.admin.getPatientDetails.useQuery(
    { id: id as string },
    { enabled: !!id }
  );

  const updatePatient = api.admin.updatePatient.useMutation({
    onSuccess: () => {
      notification.success("تم تحديث بيانات المريض بنجاح");
      void refetch();
      setIsEditing(false);
    },
    onError: () => notification.error("فشل في تحديث البيانات"),
  });

  const addSessionNote = api.admin.addSessionNote.useMutation({
    onSuccess: () => {
      notification.success("تم إضافة ملاحظات الطبيب بنجاح");
      void refetch();
      setShowNoteModal(false);
      resetNote();
      // Auto-expand the booking to show the new note
      if (selectedBookingForNote) {
        setExpandedBooking(selectedBookingForNote.id);
      }
    },
    onError: () => notification.error("فشل في إضافة الملاحظات"),
  });

  const handleEdit = () => {
    if (patient) {
      setEditData({
        dateOfBirth: patient.dateOfBirth
          ? format(new Date(patient.dateOfBirth), "yyyy-MM-dd")
          : "",
        bloodType: patient.bloodType || "",
        allergies: patient.allergies || "",
        chronicConditions: patient.chronicConditions || "",
        emergencyContact: patient.emergencyContact || "",
        emergencyPhone: patient.emergencyPhone || "",
        generalNotes: patient.generalNotes || "",
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (!id) return;
    updatePatient.mutate({
      id: id as string,
      dateOfBirth: editData.dateOfBirth
        ? new Date(editData.dateOfBirth)
        : undefined,
      bloodType: editData.bloodType || undefined,
      allergies: editData.allergies || undefined,
      chronicConditions: editData.chronicConditions || undefined,
      emergencyContact: editData.emergencyContact || undefined,
      emergencyPhone: editData.emergencyPhone || undefined,
      generalNotes: editData.generalNotes || undefined,
    });
  };

  const handleOpenNoteModal = (bookingId: string, serviceName: string, patientName: string) => {
    setSelectedBookingForNote({ id: bookingId, serviceName, patientName });
    setShowNoteModal(true);
    resetNote();
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    setSelectedBookingForNote(null);
    resetNote();
  };

  const onSubmitNote = (data: SessionNoteFormData) => {
    if (!selectedBookingForNote) return;

    addSessionNote.mutate({
      bookingId: selectedBookingForNote.id,
      doctorNote: data.doctorNote,
      diagnosis: data.diagnosis || undefined,
      prescription: data.prescription || undefined,
      followUpRequired: data.followUpRequired,
      followUpDate: data.followUpDate && data.followUpRequired
        ? new Date(data.followUpDate)
        : undefined,
    });
  };

  // Calculate patient age
  const patientAge = useMemo(() => {
    if (!patient?.dateOfBirth) return null;
    return differenceInYears(new Date(), new Date(patient.dateOfBirth));
  }, [patient?.dateOfBirth]);

  if (status === "loading" || !patient) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-lg text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const avatarColor = getAvatarColor(patient.firstName);

  return (
    <>
      <Head>
        <title>
          السجل الطبي - {patient.firstName} {patient.lastName}
        </title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-accent-light via-white to-accent-light/50">
        {/* Header */}
        <header className="glass-dark sticky top-0 z-50 shadow-xl border-b border-white/10">
          <div className="container mx-auto flex items-center justify-between px-6 py-5">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:bg-white/10 hover:text-white transition-all">
                <ArrowRight className="h-4 w-4" />
                العودة للوحة التحكم
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">السجل الطبي</h1>
              <p className="text-sm text-accent-light">معلومات المريض الكاملة</p>
            </div>
            <div className="w-32"></div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Patient Header Card */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-100"
          >
            <div className="bg-gradient-to-r from-primary to-primary-light p-8 text-white">
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className={`flex h-24 w-24 items-center justify-center rounded-full ${avatarColor} text-white text-4xl font-bold shadow-2xl border-4 border-white flex-shrink-0`}>
                  {patient.firstName.charAt(0)}
                </div>

                {/* Patient Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {patient.firstName} {patient.lastName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <Mail className="h-4 w-4" />
                      {patient.email}
                    </span>
                    <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </span>
                    {patientAge && (
                      <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                        <User className="h-4 w-4" />
                        {patientAge} سنة
                      </span>
                    )}
                    {patient.bloodType && (
                      <span className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                        <Heart className="h-4 w-4" />
                        {patient.bloodType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                {!isEditing && (
                  <Button
                    onClick={handleEdit}
                    className="gap-2 bg-white text-primary hover:bg-accent-light transition-all shadow-lg"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل البيانات
                  </Button>
                )}
              </div>
            </div>

            {/* Critical Alerts */}
            {(patient.allergies || patient.chronicConditions) && (
              <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-t border-red-100">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-2">
                    {patient.allergies && (
                      <div>
                        <p className="text-sm font-bold text-red-800">⚠️ حساسية:</p>
                        <p className="text-sm text-red-700">{patient.allergies}</p>
                      </div>
                    )}
                    {patient.chronicConditions && (
                      <div>
                        <p className="text-sm font-bold text-orange-800">📋 أمراض مزمنة:</p>
                        <p className="text-sm text-orange-700">{patient.chronicConditions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Medical Information Grid */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">المعلومات الشخصية</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    تاريخ الميلاد
                  </Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editData.dateOfBirth}
                      onChange={(e) =>
                        setEditData({ ...editData, dateOfBirth: e.target.value })
                      }
                      dir="rtl"
                      lang="ar"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.dateOfBirth
                        ? format(new Date(patient.dateOfBirth), "dd MMMM yyyy", {
                            locale: ar,
                          })
                        : "غير محدد"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    فصيلة الدم
                  </Label>
                  {isEditing ? (
                    <Select
                      value={editData.bloodType}
                      onValueChange={(value) =>
                        setEditData({ ...editData, bloodType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر فصيلة الدم" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.bloodType || "غير محدد"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Medical Data Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">البيانات الطبية</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    الحساسية
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.allergies}
                      onChange={(e) =>
                        setEditData({ ...editData, allergies: e.target.value })
                      }
                      placeholder="أي حساسية من أدوية أو مواد..."
                      rows={2}
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.allergies || "لا توجد"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    الأمراض المزمنة
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.chronicConditions}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          chronicConditions: e.target.value,
                        })
                      }
                      placeholder="السكري، الضغط، أمراض القلب، إلخ..."
                      rows={2}
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.chronicConditions || "لا توجد"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">جهة الاتصال للطوارئ</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    الاسم
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyContact}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          emergencyContact: e.target.value,
                        })
                      }
                      placeholder="اسم جهة الاتصال"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.emergencyContact || "غير محدد"}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" />
                    رقم الهاتف
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.emergencyPhone}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          emergencyPhone: e.target.value,
                        })
                      }
                      placeholder="01012345678"
                    />
                  ) : (
                    <p className="font-semibold text-gray-900">
                      {patient.emergencyPhone || "غير محدد"}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* General Notes Card */}
          {(isEditing || patient.generalNotes) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">ملاحظات عامة</h3>
              </div>

              {isEditing ? (
                <Textarea
                  value={editData.generalNotes}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      generalNotes: e.target.value,
                    })
                  }
                  placeholder="أي ملاحظات طبية عامة عن المريض..."
                  rows={4}
                  className="w-full"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {patient.generalNotes}
                </p>
              )}
            </motion.div>
          )}

          {/* Edit Mode Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex gap-3 justify-center"
            >
              <Button
                onClick={handleSave}
                disabled={updatePatient.isPending}
                className="gap-2 px-8"
                style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
              >
                <Save className="h-4 w-4" />
                {updatePatient.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="gap-2 px-8"
              >
                <X className="h-4 w-4" />
                إلغاء
              </Button>
            </motion.div>
          )}

          {/* Booking History Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-1">
                  سجل الجلسات الطبية
                </h2>
                <p className="text-gray-600">
                  {patient.bookings.length} {patient.bookings.length === 1 ? "جلسة" : "جلسات"}
                </p>
              </div>
            </div>

            {patient.bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">لا توجد جلسات مسجلة</p>
                <p className="text-sm text-gray-500">سيتم عرض سجل الجلسات هنا</p>
              </div>
            ) : (
              <div className="relative space-y-6">
                {/* Timeline Line */}
                <div className="absolute right-[23px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary-light to-accent" />

                {patient.bookings.map((booking, index) => {
                  const isExpanded = expandedBooking === booking.id;
                  const statusColors = {
                    COMPLETED: "from-emerald-500 to-green-600",
                    CONFIRMED: "from-blue-500 to-blue-600",
                    PENDING: "from-amber-500 to-orange-600",
                    CANCELLED: "from-red-500 to-red-600",
                  };
                  const statusLabels = {
                    COMPLETED: "مكتمل",
                    CONFIRMED: "مؤكد",
                    PENDING: "قيد الانتظار",
                    CANCELLED: "ملغي",
                  };

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute right-0 top-4 h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br ${statusColors[booking.status]} shadow-lg z-10`}>
                        {booking.status === "COMPLETED" && <CheckCircle className="h-6 w-6 text-white" />}
                        {booking.status === "CONFIRMED" && <CheckCircle className="h-6 w-6 text-white" />}
                        {booking.status === "PENDING" && <Clock className="h-6 w-6 text-white" />}
                        {booking.status === "CANCELLED" && <XCircle className="h-6 w-6 text-white" />}
                      </div>

                      {/* Timeline Content Card */}
                      <div className="mr-20 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-primary">
                                {booking.service.name}
                              </h3>
                              <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${statusColors[booking.status]} px-3 py-1 text-xs font-semibold text-white shadow-sm`}>
                                {statusLabels[booking.status]}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(booking.date), "dd MMMM yyyy", {
                                  locale: ar,
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(booking.startTime), "h:mm a", {
                                  locale: ar,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Add Session Note Button - Show for CONFIRMED and COMPLETED bookings */}
                        {(booking.status === "CONFIRMED" || booking.status === "COMPLETED") && (
                          <div className="mb-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleOpenNoteModal(
                                  booking.id,
                                  booking.service.name,
                                  `${patient.firstName} ${patient.lastName}`
                                )
                              }
                              className="gap-2"
                              style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                            >
                              <Plus className="h-4 w-4" />
                              إضافة ملاحظات الطبيب
                            </Button>
                          </div>
                        )}

                        {/* Patient Notes */}
                        {booking.notes && (
                          <div className="mb-4 rounded-lg bg-blue-50 p-4 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              ملاحظات المريض
                            </p>
                            <p className="text-sm text-blue-900">{booking.notes}</p>
                          </div>
                        )}

                        {/* Session Notes Toggle */}
                        {booking.sessionNotes.length > 0 && (
                          <>
                            <button
                              onClick={() =>
                                setExpandedBooking(isExpanded ? null : booking.id)
                              }
                              className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  إخفاء ملاحظات الطبيب
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  عرض ملاحظات الطبيب ({booking.sessionNotes.length})
                                </>
                              )}
                            </button>

                            {/* Expandable Session Notes */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden mt-4"
                                >
                                  <div className="space-y-4">
                                    {booking.sessionNotes.map((note) => (
                                      <div
                                        key={note.id}
                                        className="rounded-lg bg-gradient-to-br from-primary/5 to-accent/10 p-5 border border-primary/10"
                                      >
                                        <div className="mb-3 flex items-center justify-between">
                                          <p className="font-bold text-primary flex items-center gap-2">
                                            <Stethoscope className="h-4 w-4" />
                                            ملاحظات الطبيب
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {format(
                                              new Date(note.createdAt),
                                              "dd MMMM yyyy - h:mm a",
                                              { locale: ar }
                                            )}
                                          </p>
                                        </div>

                                        <p className="mb-4 text-sm text-gray-700 bg-white rounded-lg p-3">
                                          {note.doctorNote}
                                        </p>

                                        {note.diagnosis && (
                                          <div className="mb-3 bg-white rounded-lg p-3">
                                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                                              <Activity className="h-3 w-3" />
                                              التشخيص
                                            </p>
                                            <p className="text-sm text-gray-700">
                                              {note.diagnosis}
                                            </p>
                                          </div>
                                        )}

                                        {note.prescription && (
                                          <div className="mb-3 bg-white rounded-lg p-3">
                                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                                              <Pill className="h-3 w-3" />
                                              الوصفة الطبية
                                            </p>
                                            <p className="text-sm text-gray-700">
                                              {note.prescription}
                                            </p>
                                          </div>
                                        )}

                                        {note.followUpRequired && (
                                          <div className="flex items-center gap-2 rounded-lg bg-amber-100 p-3 border border-amber-200">
                                            <AlertTriangle className="h-4 w-4 text-amber-700 flex-shrink-0" />
                                            <p className="text-sm font-semibold text-amber-800">
                                              يتطلب متابعة
                                              {note.followUpDate &&
                                                ` في ${format(new Date(note.followUpDate), "dd MMMM yyyy", { locale: ar })}`}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Session Note Modal */}
      <AnimatePresence>
        {showNoteModal && selectedBookingForNote && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseNoteModal}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* Header */}
              <div
                className="px-8 py-6 text-white"
                style={{
                  background: "linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)",
                }}
              >
                <h2 className="text-2xl font-bold">إضافة ملاحظات الطبيب</h2>
                <p className="mt-2 text-sm opacity-90">
                  المريض: {selectedBookingForNote.patientName} • الخدمة:{" "}
                  {selectedBookingForNote.serviceName}
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmitNote(onSubmitNote)}
                className="max-h-[70vh] overflow-y-auto p-8"
              >
                <div className="space-y-6">
                  {/* Doctor Note */}
                  <div>
                    <Label htmlFor="doctorNote" className="text-lg">
                      ملاحظات الطبيب <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="doctorNote"
                      {...registerNote("doctorNote")}
                      placeholder="أدخل ملاحظات الطبيب حول الجلسة..."
                      rows={4}
                      className="mt-2"
                    />
                    {noteErrors.doctorNote && (
                      <p className="mt-1 text-sm text-red-600">
                        {noteErrors.doctorNote.message}
                      </p>
                    )}
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <Label htmlFor="diagnosis" className="text-lg">
                      التشخيص
                    </Label>
                    <Textarea
                      id="diagnosis"
                      {...registerNote("diagnosis")}
                      placeholder="التشخيص (اختياري)..."
                      rows={3}
                      className="mt-2"
                    />
                    {noteErrors.diagnosis && (
                      <p className="mt-1 text-sm text-red-600">
                        {noteErrors.diagnosis.message}
                      </p>
                    )}
                  </div>

                  {/* Prescription */}
                  <div>
                    <Label htmlFor="prescription" className="text-lg">
                      الروشتة الطبية
                    </Label>
                    <Textarea
                      id="prescription"
                      {...registerNote("prescription")}
                      placeholder="الروشتة الطبية (اختياري)..."
                      rows={3}
                      className="mt-2"
                    />
                    {noteErrors.prescription && (
                      <p className="mt-1 text-sm text-red-600">
                        {noteErrors.prescription.message}
                      </p>
                    )}
                  </div>

                  {/* Follow-up Required */}
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      {...registerNote("followUpRequired")}
                      className="h-5 w-5 rounded border-gray-300 text-[#0a1931] focus:ring-2 focus:ring-[#4a7fa7]"
                    />
                    <Label htmlFor="followUpRequired" className="cursor-pointer text-base">
                      يتطلب متابعة
                    </Label>
                  </div>

                  {/* Follow-up Date (conditional) */}
                  {watchNote("followUpRequired") && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="followUpDate" className="text-lg">
                        تاريخ المتابعة <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        id="followUpDate"
                        {...registerNote("followUpDate")}
                        className="mt-2"
                        min={format(new Date(), "yyyy-MM-dd")}
                      />
                      {noteErrors.followUpDate && (
                        <p className="mt-1 text-sm text-red-600">
                          {noteErrors.followUpDate.message}
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseNoteModal}
                    className="w-full"
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    disabled={addSessionNote.isPending}
                    className="w-full"
                    style={{
                      background: "linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)",
                    }}
                  >
                    {addSessionNote.isPending ? "جاري الحفظ..." : "حفظ الملاحظات"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
