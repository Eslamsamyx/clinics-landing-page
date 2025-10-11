import Head from "next/head";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";
import Hero from "~/components/Hero";
import FAQ from "~/components/FAQ";
import Footer from "~/components/Footer";
import WhatsAppButton from "~/components/WhatsAppButton";
import { Clock, Stethoscope, CalendarCheck, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data: services, isLoading } = api.service.getAll.useQuery();

  return (
    <>
      <Head>
        <title>عيادات د. نادر حماد - احجز موعدك الآن</title>
        <meta
          name="description"
          content="احجز موعدك في عيادات د. نادر حماد. خدمات علاجية متميزة مع إمكانية الحجز الإلكتروني السريع."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      <Hero />

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="gradient-text mb-4 text-4xl font-bold md:text-5xl">
              خدماتنا العلاجية
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              نقدم مجموعة شاملة من الخدمات العلاجية المتخصصة لتلبية احتياجاتك
              الصحية
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-2xl bg-white/70 shadow-lg"
                  ></div>
                ))
              : services?.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur-sm"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 h-1 w-full"
                      style={{
                        background: 'linear-gradient(to left, #0a1931, #4a7fa7, #0a1931)'
                      }}
                    ></div>

                    <div
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)'
                      }}
                    >
                      <Stethoscope className="h-8 w-8 text-white" />
                    </div>

                    <h3
                      className="mb-3 text-2xl font-bold"
                      style={{ color: '#0a1931' }}
                    >
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="mb-4 text-gray-600">{service.description}</p>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock className="h-5 w-5" />
                          <span className="font-semibold">
                            {service.duration} دقيقة
                          </span>
                        </div>
                        {service.price && (
                          <div
                            className="text-2xl font-bold"
                            style={{ color: '#0a1931' }}
                          >
                            {service.price.toString()} ج.م
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/booking?service=${service.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-white font-semibold transition-all duration-300 hover:shadow-lg"
                        style={{
                          background: 'linear-gradient(135deg, #0a1931 0%, #4a7fa7 100%)'
                        }}
                      >
                        <CalendarCheck className="h-5 w-5" />
                        احجز الآن
                      </Link>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* Contact Section */}
      <section id="contact" className="relative bg-primary py-20 text-white overflow-hidden">
        {/* Background decorations matching FAQ */}
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
            {/* FAQ Transition */}
            <div className="mb-12">
              <p className="text-xl text-accent font-semibold">لم تجد إجابة لسؤالك؟</p>
            </div>

            {/* Main Contact Content */}
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">تواصل معنا</h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-accent">
              نحن هنا لخدمتك. لا تتردد في التواصل معنا لأي استفسار أو مساعدة
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

                {/* Booking Button */}
                <div className="mt-8 pt-8 border-t border-accent/20">
                  <a
                    href="/booking"
                    className="inline-block rounded-lg px-10 py-4 text-primary font-bold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-accent hover:bg-white"
                  >
                    احجز موعدك الآن
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
