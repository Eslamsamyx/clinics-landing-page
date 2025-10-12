import { useRouter } from "next/router";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, FileText, Home, MessageCircle, Send, MapPin } from "lucide-react";
import WhatsAppIcon from "~/components/icons/WhatsAppIcon";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";

export default function BookingSuccess() {
  const router = useRouter();
  const bookingId = router.query.id as string;

  // Fetch booking data securely from the server
  const { data: booking, isLoading, isError } = api.booking.getById.useQuery(
    { id: bookingId },
    { enabled: !!bookingId }
  );

  // If no booking ID, redirect to booking page
  if (!bookingId) {
    if (typeof window !== 'undefined') {
      void router.push('/booking');
    }
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navbar alwaysSolid />
        <div className="min-h-screen bg-gradient-to-br from-accent-light via-white to-accent-light/50 flex items-center justify-center pt-24" dir="rtl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">جاري تحميل بيانات الحجز...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (isError || !booking) {
    if (typeof window !== 'undefined') {
      void router.push('/booking');
    }
    return null;
  }

  const formattedDate = format(booking.date, "EEEE، dd MMMM yyyy", { locale: ar });
  const formattedTime = format(booking.startTime, "h:mm a", { locale: ar });

  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `مرحباً، لقد قمت بحجز موعد:\n\n` +
    `الخدمة: ${booking.service.name}\n` +
    `المدينة: ${booking.city}\n` +
    `التاريخ: ${formattedDate}\n` +
    `الوقت: ${formattedTime}\n` +
    `الاسم: ${booking.patient.firstName} ${booking.patient.lastName}\n` +
    (booking.patient.email ? `البريد الإلكتروني: ${booking.patient.email}\n` : '') +
    `رقم الهاتف: ${booking.patient.phone}\n` +
    (booking.notes ? `ملاحظات: ${booking.notes}` : '')
  );

  return (
    <>
      <Navbar alwaysSolid />
      <div className="min-h-screen bg-gradient-to-br from-accent-light via-white to-accent-light/50 pt-24" dir="rtl">
        <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Success Animation */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-16 w-16 text-green-600 animate-in zoom-in duration-700 delay-200" />
            </div>
            <h1 className="mb-3 text-4xl font-bold text-primary animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              تم تأكيد حجزك بنجاح!
            </h1>
            <p className="text-lg text-gray-600 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              شكراً لثقتكم بنا. سنتواصل معكم قريباً لتأكيد الموعد
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white to-accent-light p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-primary border-b-2 border-accent pb-4">
              <Calendar className="h-7 w-7 text-accent" />
              تفاصيل الحجز
            </h2>

            <div className="space-y-5">
              {/* Service */}
              <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-accent-light to-white p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1931] to-[#4a7fa7]">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">الخدمة</p>
                  <p className="text-xl font-bold text-primary">{booking.service.name}</p>
                </div>
              </div>

              {/* City */}
              <div className="flex items-start gap-4 rounded-lg bg-gradient-to-r from-accent-light to-white p-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1931] to-[#4a7fa7]">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">المدينة</p>
                  <p className="text-xl font-bold text-primary">{booking.city}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-accent-light to-white p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1931] to-[#4a7fa7]">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">التاريخ</p>
                    <p className="font-bold text-gray-900">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-accent-light to-white p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1931] to-[#4a7fa7]">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">الوقت</p>
                    <p className="font-bold text-gray-900">{formattedTime}</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">الاسم</p>
                    <p className="font-semibold text-gray-900">{booking.patient.firstName} {booking.patient.lastName}</p>
                  </div>
                </div>

                {booking.patient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-semibold text-gray-900">{booking.patient.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-semibold text-gray-900" dir="ltr">{booking.patient.phone}</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="flex items-start gap-3 pt-3 border-t border-gray-200">
                    <FileText className="h-5 w-5 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">ملاحظات</p>
                      <p className="text-gray-900">{booking.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="mb-8 rounded-xl bg-amber-50 border-2 border-amber-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1000">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                <MessageCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="mb-2 font-bold text-amber-900">ملاحظة هامة</h3>
                <p className="text-amber-800">
                  سيتم التواصل معكم خلال 24 ساعة لتأكيد الموعد. في حالة عدم التواصل، الرجاء الاتصال بنا مباشرة.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200">
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/218930006615?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <WhatsAppIcon className="h-5 w-5" />
              تواصل عبر واتساب
            </a>

            {/* Contact Section Button */}
            <Link
              href="/#contact"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
            >
              <Send className="h-5 w-5" />
              اتصل بنا
            </Link>

            {/* Home Button */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
            >
              <Home className="h-5 w-5" />
              العودة للرئيسية
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center animate-in fade-in duration-700 delay-1500">
            <p className="text-gray-600">
              هل تريد حجز موعد آخر؟{" "}
              <Link href="/booking" className="font-bold text-primary hover:underline">
                احجز الآن
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
