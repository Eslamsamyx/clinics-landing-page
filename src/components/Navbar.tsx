import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, LogIn } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  alwaysSolid?: boolean;
}

export default function Navbar({ alwaysSolid = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isScrolledOrSolid = scrolled || alwaysSolid;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{
        y: 0,
        height: isScrolledOrSolid ? "70px" : "90px"
      }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolledOrSolid
          ? "glass-dark shadow-2xl backdrop-blur-xl bg-primary border-b border-white/10"
          : "bg-transparent shadow-none backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="flex items-center justify-between"
          animate={{ height: isScrolledOrSolid ? "70px" : "90px" }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative h-12 w-12 rounded-full overflow-hidden"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/dr-nader-hammad-icon.webp"
                alt="عيادات د. نادر حماد"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </motion.div>
            <div className="text-white">
              <h1 className="text-base font-bold sm:text-lg md:text-xl transition-all duration-300 group-hover:text-accent drop-shadow-lg">
                عيادات د. نادر حماد
              </h1>
              <p className="text-[10px] text-accent sm:text-xs drop-shadow-md">خير الناس أنفعهم للناس</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#about" className="relative group">
              <span className="text-accent transition-colors duration-300 group-hover:text-white drop-shadow-md">
                عن الدكتور
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/#services" className="relative group">
              <span className="text-accent transition-colors duration-300 group-hover:text-white drop-shadow-md">
                الخدمات
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/#faq" className="relative group">
              <span className="text-accent transition-colors duration-300 group-hover:text-white drop-shadow-md">
                الأسئلة الشائعة
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/#contact" className="relative group">
              <span className="text-accent transition-colors duration-300 group-hover:text-white drop-shadow-md">
                تواصل معنا
              </span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/booking">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="gap-2 bg-accent text-primary hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-bold">
                  <Calendar className="h-4 w-4" />
                  احجز موعد
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden border-t border-white/10 ${
              isScrolledOrSolid ? "glass-dark" : "bg-primary/90 backdrop-blur-md"
            }`}
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {[
                { href: "/#about", label: "عن الدكتور" },
                { href: "/#services", label: "الخدمات" },
                { href: "/booking", label: "احجز موعد" },
                { href: "/#faq", label: "الأسئلة الشائعة" },
                { href: "/#contact", label: "تواصل معنا" }
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-right text-accent transition-all duration-300 hover:text-white hover:translate-x-2 py-2"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
