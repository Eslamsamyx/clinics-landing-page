import { motion } from "framer-motion";
import { Stethoscope, Calendar, FileText, CheckCircle, ArrowLeft } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Stethoscope,
      title: "اختر الخدمة",
      description: "اختر الخدمة العلاجية المناسبة من بين خدماتنا المتنوعة",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "02",
      icon: Calendar,
      title: "حدد الموعد",
      description: "اختر التاريخ والوقت المناسب لك من بين المواعيد المتاحة",
      color: "from-purple-500 to-indigo-500",
    },
    {
      number: "03",
      icon: FileText,
      title: "أدخل بياناتك",
      description: "أكمل معلوماتك الشخصية والطبية بشكل آمن ومشفر",
      color: "from-orange-500 to-yellow-500",
    },
    {
      number: "04",
      icon: CheckCircle,
      title: "تأكيد الحجز",
      description: "احصل على تأكيد فوري لحجزك مع تفاصيل الموعد",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent-light to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-accent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
            كيف يعمل الحجز؟
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            عملية حجز بسيطة وسريعة في 4 خطوات فقط
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
          {/* Connector Lines (desktop only) */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Step Card */}
              <motion.div
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                style={{ border: '1px solid rgba(0,0,0,0.05)' }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -right-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="mb-6 mt-4">
                  <div
                    className={`inline-flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-md`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="mb-3 text-2xl font-bold"
                  style={{ color: '#0a1931' }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Bottom accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${step.color} rounded-b-2xl`}
                ></div>
              </motion.div>

              {/* Arrow (desktop only, except last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -left-8 text-primary/30 z-20">
                  <ArrowLeft className="h-16 w-16" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0a1931' }}>
              جاهز للبدء؟
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              احجز موعدك الآن واستمتع بتجربة علاجية متميزة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="/booking"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-white font-bold text-lg transition-all duration-300 hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)'
                }}
              >
                <Calendar className="h-5 w-5" />
                احجز موعدك الآن
              </motion.a>
              <motion.a
                href="tel:+218920006674"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-lg px-8 py-4 font-bold text-lg transition-all duration-300 hover:shadow-lg border-2"
                style={{
                  color: '#0a1931',
                  borderColor: '#0a1931'
                }}
              >
                اتصل بنا الآن
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
