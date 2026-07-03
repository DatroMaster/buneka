import { Headset } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export function FloatingWhatsappSupport() {
  return (
    <a
      href={whatsappLink("Merhaba, Buneka kullanımı hakkında destek almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp destek hattı"
      className="fixed bottom-4 right-4 z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/35 bg-gradient-to-br from-emerald-300 via-cyan-300 to-blue-500 text-slate-950 shadow-[0_18px_44px_rgba(34,211,238,0.30)] transition-transform hover:scale-105 active:scale-95"
    >
      <span aria-hidden className="absolute inset-0 rounded-full bg-emerald-300/30 blur-xl" />
      <Headset size={26} className="relative" strokeWidth={2.4} />
      <span className="sr-only">WhatsApp destek hattı</span>
    </a>
  );
}
