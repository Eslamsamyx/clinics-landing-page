import { motion } from "framer-motion";
import {
  Microscope,
  Shield,
  Users,
  ClipboardCheck,
  Heart,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Microscope,
      title: "أحدث المعدات الطبية",
      description: "نستخدم أحدث التقنيات والمعدات الطبية لضمان أفضل نتائج علاجية",
    },
    {
      icon: Shield,
      title: "نظافة وتعقيم عالي المستوى",
      description: "نلتزم بأعلى معايير النظافة والتعقيم لضمان سلامتك",
    },
    {
      icon: Users,
      title: "فريق طبي متخصص",
      description: "فريق من الأطباء والمعالجين ذوي الخبرة والكفاءة العالية",
    },
    {
      icon: ClipboardCheck,
      title: "سجلات طبية إلكترونية",
      description: "نظام حديث لإدارة السجلات الطبية يضمن متابعة دقيقة لحالتك",
    },
    {
      icon: Heart,
      title: "متابعة ما بعد العلاج",
      description: "نهتم بمتابعتك بعد العلاج لضمان استمرار تحسن حالتك",
    },
    {
      icon: TrendingUp,
      title: "نتائج مثبتة علمياً",
      description: "نعتمد على أساليب علاجية مثبتة علمياً وذات نتائج فعالة",
    },
    {
      icon: Sparkles,
      title: "علاج شامل ومتكامل",
      description: "نجمع بين الطب التقليدي والبديل لعلاج شامل ومتكامل",
    },
    {
      icon: Clock,
      title: "مواعيد مرنة ومناسبة",
      description: "نوفر مواعيد مرنة تناسب جدولك اليومي مع إمكانية الحجز الفوري",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1931 0%, #1a3d63 50%, #0a1931 100%)' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-10 h-96 w-96 rounded-full blur-3xl" style={{ background: '#4a7fa7' }}></div>
        <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full blur-3xl" style={{ background: '#b3cfe5' }}></div>
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
          <h2 className="mb-4 text-4xl font-bold md:text-5xl text-white">
            لماذا تختارنا؟
          </h2>
          <p className="mx-auto max-w-2xl text-lg" style={{ color: '#b3cfe5' }}>
            نقدم لك أفضل تجربة علاجية بمعايير عالمية وخدمة متميزة
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative overflow-hidden rounded-2xl p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(179,207,229,0.3)] transition-all duration-300"
              style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
            >
              {/* Gradient hover effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)',
                }}
              ></div>

              {/* Icon */}
              <div className="relative mb-4">
                <div
                  className="inline-flex w-16 h-16 items-center justify-center rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
              </div>

              {/* Content */}
              <h3
                className="mb-3 text-xl font-bold transition-colors duration-300"
                style={{ color: '#0a1931' }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'linear-gradient(to right, #0a1931 0%, #4a7fa7 100%)' }}
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg mb-6" style={{ color: '#b3cfe5' }}>
            جرب تجربة علاجية فريدة تجمع بين الطب التقليدي والحديث
          </p>
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-lg px-8 py-4 font-bold text-lg transition-all duration-300 hover:shadow-[0_10px_40px_rgba(179,207,229,0.4)]"
            style={{
              background: '#b3cfe5',
              color: '#0a1931'
            }}
          >
            احجز موعدك الآن
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
