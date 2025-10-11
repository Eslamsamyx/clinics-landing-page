import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const whatsappNumber = "+201021133317";
  const whatsappMessage = encodeURIComponent("مرحباً، أود الاستفسار عن حجز موعد في العيادات");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-3xl"
      style={{
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
      }}
      aria-label="تواصل عبر واتساب"
    >
      <FaWhatsapp className="h-9 w-9 text-white" />
    </a>
  );
}
