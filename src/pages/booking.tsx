import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import ArabicBookingForm from "~/components/ArabicBookingForm";
import WhatsAppButton from "~/components/WhatsAppButton";
import { Calendar, Phone, MessageCircle } from "lucide-react";

export default function Booking() {
  return (
    <>
      <Head>
        <title>احجز موعدك - عيادات د. نادر حماد</title>
        <meta
          name="description"
          content="احجز موعدك في عيادات د. نادر حماد. اختر الخدمة المناسبة والتاريخ والوقت الذي يناسبك."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* Page Header */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background: "linear-gradient(135deg, #0a1931 0%, #1a3d63 50%, #4a7fa7 100%)",
        }}
      >
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <Calendar className="h-10 w-10" />
            </div>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl">احجز موعدك الآن</h1>
            <p className="mx-auto max-w-2xl text-xl text-accent-light">
              اختر الخدمة المناسبة والتاريخ والوقت الذي يناسبك، وسنتواصل معك لتأكيد الموعد
            </p>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-0 h-full w-full opacity-10">
          <div
            className="absolute -left-20 top-20 h-64 w-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(179, 207, 229, 0.4) 0%, transparent 70%)",
            }}
          ></div>
          <div
            className="absolute -right-20 bottom-20 h-96 w-96 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(179, 207, 229, 0.3) 0%, transparent 70%)",
            }}
          ></div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="bg-gradient-to-b from-white to-accent-light py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ArabicBookingForm />
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="mx-auto max-w-3xl rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-sm">
              <h3 className="mb-4 text-2xl font-bold" style={{ color: "#0a1931" }}>
                ملاحظات هامة
              </h3>
              <ul className="space-y-3 text-right text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-white">
                    ✓
                  </span>
                  <span>سيتم التواصل معك لتأكيد الموعد خلال 24 ساعة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-white">
                    ✓
                  </span>
                  <span>يُرجى الحضور قبل الموعد المحدد بـ 10 دقائق</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-white">
                    ✓
                  </span>
                  <span>في حالة الرغبة في إلغاء أو تعديل الموعد، يُرجى التواصل معنا قبل 24 ساعة على الأقل</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative bg-primary py-20 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-accent blur-3xl"></div>
          <div className="absolute bottom-10 right-20 h-64 w-64 rounded-full bg-primary-light blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Header */}
            <div className="mb-12">
              <p className="text-xl text-accent font-semibold">هل تحتاج مساعدة في الحجز؟</p>
            </div>

            {/* Main Contact Content */}
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">تواصل معنا</h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-accent">
              نحن هنا لمساعدتك في اختيار الخدمة المناسبة وإتمام الحجز
            </p>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mx-auto max-w-lg"
            >
              <div className="rounded-2xl bg-primary-dark/60 backdrop-blur-sm p-10 shadow-2xl border border-accent/30">
                <p className="mb-6 text-lg text-accent">للحجز والاستفسارات</p>

                {/* Phone Number */}
                <a
                  href="tel:+201021133317"
                  className="inline-flex items-center gap-3 text-4xl font-bold text-white hover:text-accent transition-colors duration-300 mb-6"
                >
                  <Phone className="h-10 w-10" />
                  <span dir="ltr">+201021133317</span>
                </a>

                {/* WhatsApp Button */}
                <div className="mt-6">
                  <a
                    href="https://wa.me/201021133317"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-lg px-8 py-3 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{ background: '#25D366' }}
                  >
                    <MessageCircle className="h-6 w-6" />
                    تواصل عبر واتساب
                  </a>
                </div>

                {/* Back to Home */}
                <div className="mt-8 pt-8 border-t border-accent/20">
                  <a
                    href="/"
                    className="inline-block rounded-lg px-10 py-4 text-primary font-bold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-accent hover:bg-white"
                  >
                    العودة للصفحة الرئيسية
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
