import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "أحمد محمود",
      treatment: "علاج العمود الفقري",
      rating: 5,
      text: "تجربة رائعة! عانيت من آلام الظهر لسنوات وبعد جلسات العلاج الطبيعي مع د. نادر تحسنت حالتي بشكل ملحوظ. أسلوب العلاج احترافي والمتابعة ممتازة.",
      date: "منذ شهرين",
    },
    {
      name: "فاطمة حسن",
      treatment: "الإبر الصينية",
      rating: 5,
      text: "كنت أعاني من آلام مزمنة في الركبة وجربت الإبر الصينية لأول مرة. النتائج فاقت توقعاتي! د. نادر محترف جداً ويشرح كل خطوة بوضوح.",
      date: "منذ 3 أشهر",
    },
    {
      name: "محمد عبدالله",
      treatment: "العلاج الطبيعي للرياضيين",
      rating: 5,
      text: "بعد إصابة رياضية، كنت بحاجة لعلاج متخصص. البرنامج العلاجي كان مصمم خصيصاً لحالتي وعدت للملاعب أقوى من قبل. شكراً د. نادر!",
      date: "منذ شهر",
    },
    {
      name: "سارة أحمد",
      treatment: "التغذية العلاجية",
      rating: 5,
      text: "البرنامج الغذائي المخصص لي ساعدني كثيراً في تحسين صحتي وطاقتي اليومية. المتابعة المستمرة والنصائح القيمة جعلت الفرق واضح.",
      date: "منذ 4 أشهر",
    },
    {
      name: "خالد عمر",
      treatment: "الحجامة والعلاج التقليدي",
      rating: 5,
      text: "أفضل مركز علاجي جربته. الجمع بين العلاج التقليدي والحديث أعطى نتائج رائعة. النظافة والاهتمام بالتفاصيل في أعلى مستوى.",
      date: "منذ شهرين",
    },
    {
      name: "نورا إبراهيم",
      treatment: "علاج المفاصل",
      rating: 5,
      text: "عانيت من التهاب المفاصل لفترة طويلة. العلاج الشامل والمتابعة الدقيقة جعلتني أشعر بتحسن كبير. أنصح الجميع بالتجربة.",
      date: "منذ شهر",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 h-96 w-96 rounded-full bg-accent blur-3xl"></div>
        <div className="absolute bottom-10 left-20 h-96 w-96 rounded-full bg-primary blur-3xl"></div>
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
            آراء مرضانا
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            تجارب حقيقية من مرضى استفادوا من خدماتنا العلاجية
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              style={{ border: '1px solid rgba(0,0,0,0.05)' }}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg">
                <Quote className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <div className="relative">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 leading-relaxed mb-6 text-right">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-bold" style={{ color: '#0a1931' }}>
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.treatment}</p>
                  </div>
                  <span className="text-xs text-gray-400">{testimonial.date}</span>
                </div>
              </div>

              {/* Decorative gradient line at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary-light rounded-b-2xl"
              ></div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-accent text-sm md:text-base">نسبة الرضا</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">+500</div>
                <div className="text-accent text-sm md:text-base">مريض سعيد</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">+15</div>
                <div className="text-accent text-sm md:text-base">سنة خبرة</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
                <div className="text-accent text-sm md:text-base">تقييم عام</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            كن واحداً من مرضانا السعداء
          </p>
          <motion.a
            href="/booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-lg px-8 py-4 text-white font-bold text-lg transition-all duration-300 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)'
            }}
          >
            احجز موعدك الآن
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
