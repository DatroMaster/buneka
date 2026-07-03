import { Headset } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export function FloatingWhatsappSupport() {
  return (
    <a
      href={whatsappLink("Merhaba, Buneka kullanımı hakkında destek almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp destek hattı"
      className="fixed right-4 top-[68%] z-[9999] hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-l-2xl rounded-r-md border border-r-0 border-emerald-300/35 bg-gradient-to-br from-emerald-300 via-cyan-300 to-blue-500 text-slate-950 shadow-[0_18px_44px_rgba(34,211,238,0.24)] transition-transform hover:-translate-x-1 hover:scale-105 active:scale-95 sm:inline-flex"
    >
      <span aria-hidden className="absolute inset-0 rounded-l-2xl rounded-r-md bg-emerald-300/25 blur-xl" />
      <Headset size={24} className="relative" strokeWidth={2.4} />
      <span className="sr-only">WhatsApp destek hattı</span>
    </a>
  );
}
