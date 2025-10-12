import { motion } from "framer-motion";
import { Award, Heart, Stethoscope, Target, CheckCircle, Sparkles, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function About() {
  const qualifications = [
    {
      degree: "ماجستير العلاج الطبيعي",
      institution: "جامعة القاهرة",
    },
    {
      degree: "ماجستير التغذية العلاجية",
      institution: "البورد الأمريكي",
    },
    {
      degree: "ماجستير التجميل اللاجراحي",
      institution: "الجامعة الأمريكية",
    },
    {
      degree: "شهادة العلوم الطبية",
      institution: "البورد الأمريكي",
    },
    {
      degree: "فلسفة الطب الصيني",
      institution: "جامعة بكين",
    },
    {
      degree: "دراسة علوم الكايروبراكتيك والرفلوكسولوجي والسوجوك والسياتشو",
      institution: "المعهد التايلاندي للعلوم الطبية",
    },
  ];

  const specializations = [
    "العلاج الطبيعي المتقدم",
    "علاج العمود الفقري والمفاصل",
    "التغذية العلاجية",
    "الطب التجميلي",
    "الطب الشمولي",
    "الطب الصيني والإبر الصينية",
  ];

  const keyPoints = [
    {
      icon: Heart,
      title: "التشخيص المجاني",
      description: "نقدم التشخيص الدقيق مجاناً لجميع الحالات"
    },
    {
      icon: Target,
      title: "العلاج الطبيعي",
      description: "نتجنب العمليات الجراحية المكلفة والأدوية الكيميائية الضارة"
    },
    {
      icon: Sparkles,
      title: "الطب البديل",
      description: "نجمع بين العلاج التقليدي والحديث لنتائج أفضل"
    },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-accent-light overflow-x-clip">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
            عن الدكتور
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            رائد في مجال الطب الشمولي والعلاج الطبيعي
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-8 items-start">
          {/* Doctor Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1 lg:col-span-2 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)]"
          >
            <div className="relative">
              {/* Decorative background elements */}
              <div
                className="absolute -top-6 -right-6 w-72 h-72 rounded-full opacity-20 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
              ></div>
              <div
                className="absolute -bottom-6 -left-6 w-64 h-64 rounded-full opacity-20 blur-3xl"
                style={{ background: 'linear-gradient(135deg, #4a7fa7 0%, #0a1931 100%)' }}
              ></div>

              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div
                  className="absolute inset-0 z-10"
                  style={{
                    background: 'linear-gradient(to top, rgba(10, 25, 49, 0.3) 0%, transparent 50%)'
                  }}
                ></div>

                {/* Doctor Image */}
                <div className="relative aspect-[4/5]">
                  <Image
                    src="/dr-nader-hammad.webp"
                    alt="د. نادر حماد - استشاري العلاج الطبيعي والطب الشمولي"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Decorative border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    border: '3px solid',
                    borderImage: 'linear-gradient(135deg, #0a1931, #4a7fa7, #0a1931) 1'
                  }}
                ></div>
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                >
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-primary">+20 سنة</p>
                  <p className="text-sm text-gray-600">خبرة طبية</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Doctor Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 lg:col-span-3 space-y-8"
          >
            {/* Name and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-4xl md:text-5xl font-bold mb-3"
                style={{ color: '#0a1931' }}
              >
                د. نادر حماد
              </h3>
              <p
                className="text-xl md:text-2xl font-semibold mb-2"
                style={{ color: '#4a7fa7' }}
              >
                استشاري العلاج الطبيعي والطب الشمولي
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="h-5 w-5" style={{ color: '#4a7fa7' }} />
                <span className="font-semibold">+20 سنة خبرة طبية</span>
              </div>
            </motion.div>

            {/* Philosophy/Mission - Hero Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a1931 0%, #1a3d63 50%, #4a7fa7 100%)',
              }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl bg-white"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-accent" />
                  <h4 className="text-2xl font-bold text-white">
                    شعارنا وفلسفتنا
                  </h4>
                </div>
                <p className="text-2xl md:text-3xl leading-relaxed text-white mb-4 font-bold">
                  نفع الناس... وليس الانتفاع من الناس
                </p>
                <p className="text-lg text-accent leading-relaxed">
                  خير الناس أنفعهم للناس. نؤمن بأن التشخيص الصحيح هو جزء مهم جداً للعلاج السريع،
                  ونحاول بكل جهد لدينا مساعدة مرضانا على تجنب العمليات الجراحية المكلفة والأدوية الكيميائية الضارة.
                </p>
              </div>
            </motion.div>

            {/* Key Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="grid gap-4 md:grid-cols-3"
            >
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                  >
                    <point.icon className="h-8 w-8 text-white" />
                  </div>
                  <h5 className="font-bold text-lg" style={{ color: '#0a1931' }}>
                    {point.title}
                  </h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Specializations & Qualifications Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Qualifications */}
              <div className="p-6 rounded-2xl bg-white shadow-lg h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                  >
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: '#0a1931' }}>
                    المؤهلات العلمية
                  </h4>
                </div>
                <div className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="p-3 rounded-lg hover:bg-accent-light/50 transition-colors"
                    >
                      <p className="font-semibold text-sm mb-1" style={{ color: '#0a1931' }}>
                        {qual.degree}
                      </p>
                      <p className="text-xs text-gray-600">{qual.institution}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div className="p-6 rounded-2xl bg-white shadow-lg h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)' }}
                  >
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold" style={{ color: '#0a1931' }}>
                    التخصصات
                  </h4>
                </div>
                <div className="space-y-3">
                  {specializations.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent-light/50 transition-colors"
                    >
                      <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: '#4a7fa7' }} />
                      <span className="font-medium text-gray-700">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
