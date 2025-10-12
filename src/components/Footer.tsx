import { Phone, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WhatsAppIcon from "./icons/WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="relative h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src="/dr-nader-hammad-icon.webp"
                  alt="عيادات د. نادر حماد"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">عيادات د. نادر حماد</h3>
                <p className="text-sm text-accent">خير الناس أنفعهم للناس</p>
              </div>
            </Link>
            <p className="text-accent">
              نقدم خدمات علاجية شاملة مع فريق من المعالجين المتخصصين لضمان صحتك
              وسلامتك.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("services");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-accent transition-colors hover:text-white"
                >
                  الخدمات
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById("book");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-accent transition-colors hover:text-white"
                >
                  احجز موعد
                </button>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="text-accent transition-colors hover:text-white"
                >
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-4">
              {/* WhatsApp Numbers */}
              <li className="flex flex-col gap-2">
                <span className="text-xs text-accent/80 font-semibold">واتساب</span>
                <div className="flex items-center gap-2 text-accent">
                  <WhatsAppIcon className="h-5 w-5 flex-shrink-0" />
                  <a href="https://wa.me/218930006615" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" dir="ltr">
                    +218930006615
                  </a>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <WhatsAppIcon className="h-5 w-5 flex-shrink-0" />
                  <a href="https://wa.me/218920006674" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" dir="ltr">
                    +218920006674
                  </a>
                </div>
              </li>

              {/* Phone Number */}
              <li className="flex flex-col gap-2">
                <span className="text-xs text-accent/80 font-semibold">للحجز عن طريق الهاتف</span>
                <div className="flex items-center gap-2 text-accent">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <a href="tel:+218920006674" className="hover:text-white transition-colors" dir="ltr">
                    +218920006674
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2 text-accent">
                <MapPin className="h-5 w-5" />
                <span>ليبيا</span>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="mb-4 text-lg font-bold">ساعات العمل</h3>
            <ul className="space-y-2 text-accent">
              <li>السبت - الخميس: 9:00 ص - 5:00 م</li>
              <li>الجمعة: مغلق</li>
              <li className="mt-4 rounded-lg bg-primary-light p-3">
                <strong className="text-white">حجز المواعيد متاح 24/7</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-primary pt-8 text-center text-accent">
          <p>
            &copy; {new Date().getFullYear()} عيادات د. نادر حماد. جميع الحقوق
            محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
