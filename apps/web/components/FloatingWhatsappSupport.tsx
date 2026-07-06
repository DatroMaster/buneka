"use client";

import { Headset, X } from "lucide-react";
import { useState } from "react";
import { whatsappLink } from "@/lib/contact";

export function FloatingWhatsappSupport() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <div className="fixed right-3 top-[58%] z-[9999] hidden -translate-y-1/2 sm:block">
      <a
        href={whatsappLink("Merhaba, Buneka kullanımı hakkında destek almak istiyorum.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp destek hattı"
        className="relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-l-2xl rounded-r-md border border-r-0 border-[color:var(--buneka-accent)]/35 bg-[color:var(--buneka-accent)] text-[color:var(--buneka-base)] shadow-none transition-transform hover:-translate-x-1 hover:scale-105 active:scale-95"
      >
        <span aria-hidden className="absolute inset-0 rounded-l-2xl rounded-r-md bg-[color:var(--buneka-accent)]/18 blur-xl" />
        <Headset size={24} className="relative" strokeWidth={2.4} />
        <span className="sr-only">WhatsApp destek hattı</span>
      </a>
      <button
        type="button"
        onClick={() => setHidden(true)}
        aria-label="Canlı destek butonunu gizle"
        className="absolute -left-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-[color:var(--buneka-border)] bg-[color:var(--buneka-panel)] text-[color:var(--buneka-accent)] transition hover:border-[color:var(--buneka-accent)]"
      >
        <X size={13} />
      </button>
    </div>
  );
}
