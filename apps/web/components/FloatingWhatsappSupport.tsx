import { Headset } from "lucide-react";
import { whatsappLink } from "@/lib/contact";

export function FloatingWhatsappSupport() {
  return (
    <a
      href={whatsappLink("Merhaba, Buneka kullanımı hakkında destek almak istiyorum.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp destek hattı"
      className="fixed right-4 top-[58%] z-[9999] hidden h-[52px] w-[52px] -translate-y-1/2 items-center justify-center rounded-l-2xl rounded-r-md border border-r-0 border-[color:var(--buneka-accent)]/35 bg-[color:var(--buneka-accent)] text-[color:var(--buneka-base)] shadow-none transition-transform hover:-translate-x-1 hover:scale-105 active:scale-95 sm:inline-flex"
    >
      <span aria-hidden className="absolute inset-0 rounded-l-2xl rounded-r-md bg-[color:var(--buneka-accent)]/18 blur-xl" />
      <Headset size={24} className="relative" strokeWidth={2.4} />
      <span className="sr-only">WhatsApp destek hattı</span>
    </a>
  );
}
