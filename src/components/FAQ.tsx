import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "ما هي أنواع العلاجات المتوفرة لديكم؟",
    answer: "نقدم مجموعة شاملة من العلاجات تشمل: العلاج الطبيعي، الإبر الصينية، الكايروبراكتيك، الحجامة، المساج العلاجي، علاج آلام الظهر والرقبة، تأهيل ما بعد الجلطة، علاج الإصابات الرياضية، بالإضافة إلى العلاجات التجميلية مثل البوتكس والفيلر والميزوثيرابي.",
  },
  {
    question: "كم مدة الجلسة العلاجية؟",
    answer: "تختلف مدة الجلسة حسب نوع العلاج، حيث تتراوح بين 30 إلى 60 دقيقة. يمكنك الاطلاع على مدة كل جلسة في صفحة الخدمات أو عند الحجز.",
  },
  {
    question: "كم عدد الجلسات التي سأحتاجها؟",
    answer: "يعتمد عدد الجلسات على حالتك الصحية ونوع العلاج. سيقوم المعالج المختص بتقييم حالتك في الجلسة الأولى ووضع خطة علاجية مخصصة تحدد عدد الجلسات المطلوبة. عادةً تتراوح بين 4-12 جلسة.",
  },
  {
    question: "هل العلاجات مؤلمة؟",
    answer: "معظم العلاجات لدينا غير مؤلمة. قد تشعر ببعض الانزعاج البسيط في بعض العلاجات مثل الإبر الصينية أو الحجامة، لكنه انزعاج مؤقت وخفيف. المعالجون لدينا يحرصون على راحتك طوال الجلسة.",
  },
  {
    question: "ما الفرق بين الكايروبراكتيك والعلاج الطبيعي؟",
    answer: "الكايروبراكتيك يركز على تعديل وتقويم العمود الفقري والمفاصل لتحسين وظائف الجهاز العصبي، بينما العلاج الطبيعي يستخدم تمارين وتقنيات متنوعة لتحسين الحركة وتقوية العضلات. كلاهما فعّال ويمكن دمجهما حسب حالتك.",
  },
  {
    question: "هل يمكنني الجمع بين أكثر من علاج؟",
    answer: "نعم، في كثير من الحالات يكون الجمع بين علاجات مختلفة أكثر فعالية. سيقوم المعالج بتقييم حالتك واقتراح خطة علاجية شاملة قد تجمع بين عدة علاجات تكميلية لتحقيق أفضل النتائج.",
  },
  {
    question: "كيف يمكنني حجز موعد؟",
    answer: "يمكنك الحجز بسهولة من خلال موقعنا الإلكتروني عبر نظام الحجز الإلكتروني، أو بالاتصال المباشر على رقم العيادة. اختر الخدمة المطلوبة، الوقت المناسب، وأكمل بياناتك.",
  },
  {
    question: "ماذا يجب أن أحضر معي للجلسة؟",
    answer: "يُفضل إحضار أي تقارير طبية أو أشعة سابقة متعلقة بحالتك وبطاقة الهوية. بالنسبة للملابس، يُفضل ارتداء ملابس مريحة تسمح بحرية الحركة.",
  },
  {
    question: "ما هي ساعات العمل؟",
    answer: "نعمل يومياً من السبت إلى الخميس من الساعة 9 صباحاً حتى 9 مساءً. نوفر أيضاً مواعيد مرنة تناسب جدولك. للحالات الطارئة، نقدم خدمة الدعم على مدار الساعة.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 overflow-hidden bg-primary">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-accent blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-80 w-80 rounded-full bg-primary-light blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-white blur-2xl"></div>
      </div>

      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #b3cfe5 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
              <HelpCircle className="h-8 w-8 text-accent" />
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            الأسئلة الشائعة
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-accent">
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا العلاجية وعملية الحجز
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full rounded-xl bg-primary-dark/60 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:bg-primary-dark/80"
                style={{
                  border: openIndex === index
                    ? '2px solid #b3cfe5'
                    : '2px solid rgba(74, 127, 167, 0.3)',
                }}
              >
                {/* Using relative positioning for explicit RTL layout */}
                <div className="relative w-full pl-10">
                  {/* Question text - fills from right, reserves space on left for icon */}
                  <h3
                    className="text-right text-lg font-bold md:text-xl w-full"
                    style={{
                      color: openIndex === index ? '#ffffff' : '#b3cfe5',
                    }}
                  >
                    {faq.question}
                  </h3>

                  {/* Icon - positioned at far left */}
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0"
                  >
                    <ChevronDown
                      className="h-6 w-6"
                      style={{ color: openIndex === index ? '#b3cfe5' : '#4a7fa7' }}
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 border-t border-accent/30 pt-4 text-right leading-relaxed" style={{ color: '#e8f1f8' }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
