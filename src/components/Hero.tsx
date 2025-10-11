import { motion } from "framer-motion";
import { Calendar, Clock, Award } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary-light pt-24 pb-16">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* Large white orb - top right */}
        <motion.div
          className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white blur-3xl"
          animate={{
            x: [0, -80, 50, -30, 0],
            y: [0, 60, -40, 30, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
            opacity: [0.8, 1, 0.7, 0.9, 0.8],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Large accent orb - bottom left */}
        <motion.div
          className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-accent blur-3xl"
          animate={{
            x: [0, 70, -50, 40, 0],
            y: [0, -50, 60, -30, 0],
            scale: [1, 0.85, 1.15, 0.95, 1],
            opacity: [0.9, 0.7, 1, 0.8, 0.9],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Medium primary-light orb - center left */}
        <motion.div
          className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-primary-light blur-3xl opacity-30"
          animate={{
            x: [0, 80, -60, 40, 0],
            y: [0, -60, 50, -40, 0],
            scale: [1, 1.3, 0.7, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
          }}
        />

        {/* Medium accent orb with rotation - bottom right */}
        <motion.div
          className="absolute bottom-1/4 right-1/3 h-64 w-64 rounded-full bg-accent blur-3xl opacity-25"
          animate={{
            x: [0, -60, 80, -40, 0],
            y: [0, 70, -50, 60, 0],
            scale: [1, 1.1, 0.9, 1.2, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Small white orb - top center */}
        <motion.div
          className="absolute top-1/4 left-1/2 h-48 w-48 rounded-full bg-white blur-2xl opacity-20"
          animate={{
            x: [0, -40, 60, -30, 0],
            y: [0, 50, -30, 40, 0],
            scale: [1, 1.4, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: [0.65, 0, 0.35, 1],
          }}
        />

        {/* Small primary-light orb - right center */}
        <motion.div
          className="absolute top-1/2 right-1/4 h-40 w-40 rounded-full bg-primary-light blur-2xl opacity-15"
          animate={{
            x: [0, 50, -70, 30, 0],
            y: [0, -40, 60, -50, 0],
            scale: [1, 0.9, 1.3, 0.85, 1],
            opacity: [0.15, 0.25, 0.1, 0.2, 0.15],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            >
              رعاية صحيّة
              <br />
              <span className="bg-gradient-to-l from-accent to-white bg-clip-text text-transparent">
                متميزة
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8 text-lg text-accent md:text-xl"
            >
              نجمع بين العلاج التقليدي والحديث لتقديم علاج شامل. الإبر الصينية، الحجامة، العلاج الطبيعي، الكايروبراكتيك، والتأهيل - كل ما تحتاجه لصحة أفضل في مكان واحد.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-4 lg:justify-end"
            >
              <Link href="/booking">
                <Button
                  size="lg"
                  className="group gap-2 bg-white text-primary hover:bg-accent"
                >
                  <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
                  احجز موعدك الآن
                </Button>
              </Link>
              <Link href="/#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  تعرف على خدماتنا
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">+500</div>
                <div className="text-sm text-accent">مريض راضٍ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">+15</div>
                <div className="text-sm text-accent">سنوات خبرة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-accent">دعم متواصل</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-6"
          >
            {[
              {
                icon: Calendar,
                title: "حجز سهل وسريع",
                desc: "احجز موعدك في دقائق معدودة",
              },
              {
                icon: Clock,
                title: "مواعيد مرنة",
                desc: "نوفر مواعيد تناسب جدولك",
              },
              {
                icon: Award,
                title: "خدمة متميزة",
                desc: "فريق علاجي محترف ومتخصص",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
                className="glass hover-lift rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
