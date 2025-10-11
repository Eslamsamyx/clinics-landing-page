import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfToday } from "date-fns";
import { ar } from "date-fns/locale";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar, Clock, User, Mail, Phone, FileText, ArrowRight, ArrowLeft, Check, ClipboardList } from "lucide-react";
import { useNotification } from "./NotificationProvider";
import CustomCalendar from "./CustomCalendar";

const bookingSchema = z.object({
  serviceId: z.string({ required_error: "يرجى اختيار الخدمة" }).min(1, "يرجى اختيار الخدمة"),
  firstName: z.string({ required_error: "الاسم الأول مطلوب" })
    .min(1, "الاسم الأول مطلوب")
    .regex(/^[\p{L}\s]+$/u, "الاسم يجب أن يحتوي على حروف فقط"),
  lastName: z.string({ required_error: "اسم العائلة مطلوب" })
    .min(1, "اسم العائلة مطلوب")
    .regex(/^[\p{L}\s]+$/u, "اسم العائلة يجب أن يحتوي على حروف فقط"),
  email: z.string().optional(),
  phone: z.string({ required_error: "رقم الهاتف مطلوب" })
    .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
    .regex(/^[0-9+\-\s()]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function ArabicBookingForm() {
  const router = useRouter();
  const notification = useNotification();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const serviceId = watch("serviceId");

  const { data: services } = api.service.getAll.useQuery();
  const { data: availableSlots, refetch: refetchSlots } =
    api.booking.getAvailableSlots.useQuery(
      {
        serviceId: serviceId!,
        date: selectedDate!,
      },
      {
        enabled: !!serviceId && !!selectedDate,
      }
    );

  // Auto-select service from URL params
  useEffect(() => {
    const serviceIdFromUrl = router.query.service as string;
    if (serviceIdFromUrl && services) {
      const serviceExists = services.find((s) => s.id === serviceIdFromUrl);
      if (serviceExists) {
        setValue("serviceId", serviceIdFromUrl);
        // Auto-advance to step 2 if service is pre-selected
        setStep(2);
      }
    }
  }, [router.query.service, services, setValue]);

  const createBooking = api.booking.create.useMutation({
    onSuccess: (data) => {
      // Redirect to success page with only the booking ID
      void router.push({
        pathname: '/booking-success',
        query: {
          id: data.id,
        },
      });
    },
    onError: (error) => {
      notification.error(error.message || "حدث خطأ أثناء الحجز");
      void refetchSlots();
    },
  });

  const onSubmit = (data: BookingFormData) => {
    if (!selectedDate || !selectedTime) {
      notification.error("يرجى اختيار التاريخ والوقت");
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours!, minutes!, 0, 0);

    createBooking.mutate({
      ...data,
      date: selectedDate,
      startTime,
    });
  };

  const handleServiceChange = (value: string) => {
    setValue("serviceId", value);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
    if (date) {
      void refetchSlots();
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl bg-white/70 p-8 shadow-xl backdrop-blur-sm">
      {/* Progress Steps */}
      <div className="mb-10">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 h-2 w-[85%] bg-gray-200 rounded-full" />

          {/* Progress Bar Fill */}
          <div
            className="absolute top-8 left-1/2 -translate-x-1/2 h-2 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: '85%',
              background: step === 1 ? 'linear-gradient(to left, #4a7fa7 0%, #4a7fa7 16.66%, #e5e7eb 16.66%)'
                        : step === 2 ? 'linear-gradient(to left, #4a7fa7 0%, #4a7fa7 50%, #e5e7eb 50%)'
                        : 'linear-gradient(to left, #4a7fa7 0%, #4a7fa7 100%)'
            }}
          />

          {/* Steps */}
          <div className="relative flex items-start justify-between px-[7.5%]">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full font-bold text-xl transition-all duration-300 ${
                  step > 1
                    ? "bg-gradient-to-br from-[#0a1931] to-[#4a7fa7] text-white shadow-lg scale-95"
                    : step === 1
                    ? "bg-gradient-to-br from-[#0a1931] to-[#4a7fa7] text-white shadow-xl scale-110 ring-4 ring-accent"
                    : "bg-white text-gray-400 border-4 border-gray-200"
                }`}
              >
                {step > 1 ? (
                  <Check className="h-8 w-8 animate-in zoom-in duration-300" />
                ) : (
                  <ClipboardList className="h-8 w-8" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-base font-bold transition-colors duration-300 ${
                  step >= 1 ? "text-primary" : "text-gray-400"
                }`}>
                  اختر الخدمة
                </p>
                <p className="text-xs text-gray-500 mt-1">الخطوة 1</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full font-bold text-xl transition-all duration-300 ${
                  step > 2
                    ? "bg-gradient-to-br from-[#0a1931] to-[#4a7fa7] text-white shadow-lg scale-95"
                    : step === 2
                    ? "bg-gradient-to-br from-[#0a1931] to-[#4a7fa7] text-white shadow-xl scale-110 ring-4 ring-accent"
                    : "bg-white text-gray-400 border-4 border-gray-200"
                }`}
              >
                {step > 2 ? (
                  <Check className="h-8 w-8 animate-in zoom-in duration-300" />
                ) : (
                  <Calendar className="h-8 w-8" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-base font-bold transition-colors duration-300 ${
                  step >= 2 ? "text-primary" : "text-gray-400"
                }`}>
                  اختر الموعد
                </p>
                <p className="text-xs text-gray-500 mt-1">الخطوة 2</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full font-bold text-xl transition-all duration-300 ${
                  step === 3
                    ? "bg-gradient-to-br from-[#0a1931] to-[#4a7fa7] text-white shadow-xl scale-110 ring-4 ring-accent"
                    : "bg-white text-gray-400 border-4 border-gray-200"
                }`}
              >
                <User className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className={`text-base font-bold transition-colors duration-300 ${
                  step >= 3 ? "text-primary" : "text-gray-400"
                }`}>
                  بياناتك
                </p>
                <p className="text-xs text-gray-500 mt-1">الخطوة 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="serviceId" className="mb-3 text-lg font-semibold" style={{ color: '#0a1931' }}>
                اختر الخدمة العلاجية
              </Label>
              <Select onValueChange={handleServiceChange} value={serviceId}>
                <SelectTrigger className="mt-2 h-12 border-2 text-base font-medium">
                  <SelectValue placeholder="اختر من القائمة" />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex w-full items-center justify-between gap-4" dir="rtl">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-sm font-semibold text-gray-500">
                          {service.duration} د - {service.price?.toString()} ج.م
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="mt-2 text-sm font-medium text-red-600">
                  {errors.serviceId.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!serviceId}
              className="w-full gap-2 h-12 text-xs sm:text-sm lg:text-base font-bold shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
            >
              التالي: اختر التاريخ والوقت
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-6 flex items-center gap-2 text-lg font-semibold" style={{ color: '#0a1931' }}>
                اختر التاريخ
                <Calendar className="h-5 w-5" />
              </Label>
              <div className="rounded-2xl bg-gradient-to-br from-white to-accent-light p-6 shadow-lg border border-gray-200">
                <CustomCalendar
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabledBefore={startOfToday()}
                />
              </div>
            </div>

            {selectedDate && availableSlots && (
              <div>
                <Label className="mb-4 flex items-center gap-2 text-lg font-semibold" style={{ color: '#0a1931' }}>
                  اختر الوقت
                  <Clock className="h-5 w-5" />
                </Label>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                  {availableSlots.map((slot) => {
                    const timeString = format(slot.time, "HH:mm");
                    const isSelected = selectedTime === timeString;

                    if (slot.isBooked) {
                      return (
                        <Button
                          key={slot.time.toISOString()}
                          type="button"
                          variant="outline"
                          disabled
                          className="relative opacity-50 cursor-not-allowed bg-gray-100 border-2 border-gray-200 font-semibold text-xs sm:text-sm lg:text-base"
                        >
                          <span className="line-through text-gray-400">
                            {format(slot.time, "h:mm a", { locale: ar })}
                          </span>
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                            محجوز
                          </span>
                        </Button>
                      );
                    }

                    return (
                      <Button
                        key={slot.time.toISOString()}
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedTime(timeString)}
                        className={`transition-all duration-200 font-semibold text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                          isSelected
                            ? 'text-white border-2 shadow-lg'
                            : 'border-2 hover:border-primary hover:bg-primary hover:text-white'
                        }`}
                        style={
                          isSelected
                            ? {
                                background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)',
                                borderColor: '#0a1931'
                              }
                            : { borderColor: '#b3cfe5' }
                        }
                      >
                        {format(slot.time, "h:mm a", { locale: ar })}
                      </Button>
                    );
                  })}
                </div>
                {availableSlots.every((slot) => slot.isBooked) && (
                  <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-8 text-center mt-4">
                    <Clock className="mx-auto mb-3 h-12 w-12 text-amber-400" />
                    <p className="text-lg font-medium text-amber-800">
                      لا توجد مواعيد متاحة في هذا اليوم
                    </p>
                    <p className="mt-2 text-sm text-amber-600">
                      جميع المواعيد محجوزة. يرجى اختيار يوم آخر
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full gap-2 h-12 text-xs sm:text-sm lg:text-base font-bold border-2 border-gray-300 hover:bg-primary hover:text-white transition-all whitespace-nowrap"
              >
                <ArrowRight className="h-5 w-5" />
                السابق
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="w-full gap-2 h-12 text-xs sm:text-sm lg:text-base font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
              >
                التالي: أدخل بياناتك
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent-light p-6 shadow-lg border-2 border-gray-200">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold" style={{ color: '#0a1931' }}>
                المعلومات الشخصية
                <User className="h-6 w-6" style={{ color: '#4a7fa7' }} />
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="mb-2 flex items-center gap-2 text-base font-semibold" style={{ color: '#0a1931' }}>
                    الاسم الأول
                  </Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="أحمد"
                    className="h-12 border-2 text-base"
                    aria-required="true"
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
                      <span className="text-lg">⚠️</span>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2 flex items-center gap-2 text-base font-semibold" style={{ color: '#0a1931' }}>
                    اسم العائلة
                  </Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="محمد"
                    className="h-12 border-2 text-base"
                    aria-required="true"
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
                      <span className="text-lg">⚠️</span>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent-light p-6 shadow-lg border-2 border-gray-200">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold" style={{ color: '#0a1931' }}>
                معلومات التواصل
                <Mail className="h-6 w-6" style={{ color: '#4a7fa7' }} />
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email" className="mb-2 flex items-center gap-2 text-base font-semibold" style={{ color: '#0a1931' }}>
                    البريد الإلكتروني
                    <span className="text-sm font-normal text-gray-500">(اختياري)</span>
                    <Mail className="h-5 w-5" style={{ color: '#4a7fa7' }} />
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@email.com"
                    className="h-12 border-2 text-base"
                    aria-required="false"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
                      <span className="text-lg">⚠️</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-2 flex items-center gap-2 text-base font-semibold" style={{ color: '#0a1931' }}>
                    رقم الهاتف
                    <Phone className="h-5 w-5" style={{ color: '#4a7fa7' }} />
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="01012345678"
                    className="h-12 border-2 text-base"
                    aria-required="true"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="mt-2 flex items-center gap-1 text-sm font-medium text-red-600">
                      <span className="text-lg">⚠️</span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="rounded-2xl bg-gradient-to-br from-white to-accent-light p-6 shadow-lg border-2 border-gray-200">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold" style={{ color: '#0a1931' }}>
                ملاحظات إضافية
                <FileText className="h-6 w-6" style={{ color: '#4a7fa7' }} />
              </h3>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="أي معلومات إضافية تود إخبارنا بها..."
                rows={4}
                className="border-2 text-base resize-none"
              />
              <p className="mt-2 text-sm text-gray-500">(اختياري)</p>
            </div>

            {/* Booking Summary Section */}
            <div className="rounded-2xl p-6 shadow-xl border-2" style={{ background: 'linear-gradient(135deg, #0a1931 0%, #1a3d63 50%, #4a7fa7 100%)', borderColor: '#0a1931' }}>
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
                ملخص الحجز
                <Calendar className="h-7 w-7" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <FileText className="h-6 w-6 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-accent-light">الخدمة</p>
                    <p className="text-lg font-bold text-white">
                      {services?.find((s) => s.id === serviceId)?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <Calendar className="h-6 w-6 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-accent-light">التاريخ</p>
                    <p className="text-lg font-bold text-white">
                      {selectedDate && format(selectedDate, "dd MMMM yyyy", { locale: ar })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                  <Clock className="h-6 w-6 flex-shrink-0 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-accent-light">الوقت</p>
                    <p className="text-lg font-bold text-white">
                      {selectedTime &&
                        format(
                          new Date(`2000-01-01T${selectedTime}`),
                          "h:mm a",
                          { locale: ar }
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full gap-2 h-12 text-xs sm:text-sm lg:text-base font-bold border-2 border-gray-300 hover:bg-primary hover:text-white transition-all whitespace-nowrap"
              >
                <ArrowRight className="h-5 w-5" />
                السابق
              </Button>
              <Button
                type="submit"
                disabled={createBooking.isPending}
                className="w-full gap-2 h-12 text-xs sm:text-sm lg:text-base font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
              >
                {createBooking.isPending ? "جاري الحجز..." : "تأكيد الحجز"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
