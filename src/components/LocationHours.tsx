import { motion } from "framer-motion";
import { MapPin, Clock, Phone } from "lucide-react";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function LocationHours() {
  const cities = [
    { name: "بنغازي", nameEn: "Benghazi" },
    { name: "اجدابيا", nameEn: "Ajdabiya" },
    { name: "سبها", nameEn: "Sabha" },
    { name: "مصراته", nameEn: "Misrata" },
    { name: "طرابلس", nameEn: "Tripoli" },
  ];

  const workingHours = [
    { day: "السبت", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الأحد", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الاثنين", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الثلاثاء", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الأربعاء", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الخميس", hours: "10:00 ص - 8:00 م", isOpen: true },
    { day: "الجمعة", hours: "2:00 م - 6:00 م", isOpen: true },
  ];

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-white to-accent-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 h-96 w-96 rounded-full bg-primary blur-3xl"></div>
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-accent blur-3xl"></div>
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
            مواقعنا
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            نخدمك في 5 مدن ليبية - اختر الأقرب إليك
          </p>
        </motion.div>

        {/* Cities Grid */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#0a1931' }}>
              المدن التي نخدمها
            </h3>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-12">
            {cities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: '#0a1931' }}>
                    {city.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto"
          >
            <h4 className="text-xl font-bold mb-6 text-center" style={{ color: '#0a1931' }}>
              للحجز والاستفسارات
            </h4>
            <div className="flex flex-col gap-6">
              {/* WhatsApp Numbers */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-500">واتساب</span>
                <a
                  href="https://wa.me/218930006615"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent-light text-xl font-bold hover:text-primary-light transition-colors"
                  style={{ color: '#0a1931' }}
                >
                  <WhatsAppIcon className="h-6 w-6 text-green-600" />
                  <span dir="ltr">+218930006615</span>
                </a>
                <a
                  href="https://wa.me/218920006674"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent-light text-xl font-bold hover:text-primary-light transition-colors"
                  style={{ color: '#0a1931' }}
                >
                  <WhatsAppIcon className="h-6 w-6 text-green-600" />
                  <span dir="ltr">+218920006674</span>
                </a>
              </div>

              {/* Phone Numbers */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-500">للحجز عن طريق الهاتف</span>
                <a
                  href="tel:+218920006674"
                  className="flex items-center gap-3 p-4 rounded-lg bg-accent-light text-xl font-bold hover:text-primary-light transition-colors"
                  style={{ color: '#0a1931' }}
                >
                  <Phone className="h-6 w-6 text-primary" />
                  <span dir="ltr">+218920006674</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
