"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { modules } from "@/lib/content/modules";

const DETAILS: Record<string, string[]> = {
  "Son kullanma tarihi takibi": [
    "SKT yaklaşan ürünleri önceden görürsünüz.",
    "Fireyi azaltır, raf kontrolünü düzenli hale getirir.",
    "Market, petshop ve kozmetik gibi tarih hassasiyeti olan işletmeler için idealdir.",
  ],
  "Raf etiketi yazdırma": [
    "Barkod ve fiyat bilgisini raf etiketi formatında hazırlarsınız.",
    "Fiyat değişimlerinde çalışanların aynı bilgiyi görmesini sağlar.",
    "Müşterinin rafta gördüğü fiyat ile kasadaki fiyatı tutarlı tutar.",
  ],
  "Excel toplu ürün aktarımı": [
    "Var olan ürün listenizi tek tek girmek yerine toplu içe aktarabilirsiniz.",
    "Açılış kurulumunu hızlandırır ve ürün kataloğunu daha hızlı yayına alır.",
    "Yoğun ürün çeşitliliği olan işletmeler için zaman kazandırır.",
  ],
  "Çoklu cihaz senkronizasyonu": [
    "Aynı işletmeyi birden fazla telefon, tablet veya bilgisayardan yönetirsiniz.",
    "Çalışanlar aynı ürün, stok ve kasa bilgisini görür.",
    "Şube veya vardiya düzeni olan işletmelerde ortak hafıza sağlar.",
  ],
  "Cari müşteri ve veresiye defteri": [
    "Müşteri borçlarını, tahsilatlarını ve kalan bakiyeyi takip edersiniz.",
    "Kağıt defter riskini azaltır, ödeme geçmişini görünür kılar.",
    "Mahalle esnafı ve düzenli müşteriyle çalışan işletmeler için güçlüdür.",
  ],
  "Bulut yedekleme": [
    "İşletme verileriniz düzenli olarak güvenli şekilde yedeklenir.",
    "Cihaz değişiminde veya teknik problemde veri kaybı riskini azaltır.",
    "Patron ekranı ve çoklu cihaz akışları için güvenli temel oluşturur.",
  ],
  "Beden ve renk varyantı": [
    "Aynı ürünün beden ve renk kırılımlarını ayrı stok olarak izlersiniz.",
    "Giyim ve ayakkabı gibi varyantlı ürünlerde stok karmaşasını azaltır.",
    "Hangi varyantın daha hızlı tükendiğini görmenize yardımcı olur.",
  ],
  "Metre, kilo ve birim takibi": [
    "Metre, kilo, adet gibi farklı ölçü birimleriyle ürün takibi yaparsınız.",
    "Hırdavat, şarküteri ve züccaciye gibi esnek satış yapan işletmeler için uygundur.",
    "Satış ve stok hareketleri aynı ölçü mantığıyla kaydedilir.",
  ],
  "Uzaktan / yerinde kurulum desteği": [
    "Kurulum ve ilk eğitim sürecinde destek alırsınız.",
    "Ürün, stok, kasa ve kullanıcı ayarları işletmenize göre düzenlenir.",
    "Hızlı yayına almak isteyen ekipler için başlangıç süresini kısaltır.",
  ],
  "Fatura fotoğrafından ürün aktarımı": [
    "Tedarikçi faturasının fotoğrafını çekerek ürünleri sisteme aktarmayı hızlandırır.",
    "Ürün adı, adet ve fiyat bilgilerini manuel giriş yükünden kurtarır.",
    "Yoğun mal kabul yapan işletmelerde süre ve operasyon maliyetini düşürür.",
  ],
};

export function ModuleAccordionExplorer() {
  const [activeLabel, setActiveLabel] = useState(modules[0]?.label || "");
  const active = modules.find((module) => module.label === activeLabel) || modules[0];
  const Icon = active.icon;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
      <aside className="glow-border flex min-h-0 flex-col rounded-2xl bg-[color:var(--home-surface)]/75 p-3 backdrop-blur-xl">
        <p className="px-2 pb-2 text-[11px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">
          10 ek modül
        </p>
        <div className="grid gap-2">
          {modules.map((module) => {
            const isActive = module.label === active.label;
            const ModuleIcon = module.icon;
            return (
              <button
                key={module.label}
                type="button"
                onClick={() => setActiveLabel(module.label)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? "border-[color:var(--home-glow)] bg-[color:var(--home-glow)]/12 text-[color:var(--home-ink)] shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                    : "border-[color:var(--home-border)] text-[color:var(--home-muted)] hover:border-[color:var(--home-glow)] hover:text-[color:var(--home-ink)]"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-glow)]">
                  <ModuleIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">{module.label}</span>
                  <span className="mt-1 block text-xs font-bold text-[color:var(--home-glow)]">{module.price}</span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="glow-border flex min-h-0 flex-col rounded-2xl bg-[color:var(--home-surface)]/75 p-6 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/10 text-[color:var(--home-glow)]">
              <Icon size={26} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-wide text-[color:var(--home-glow)]">Ek modül detayı</p>
            <h2 className="font-display mt-2 text-3xl font-black tracking-tight text-[color:var(--home-ink)]">{active.label}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--home-muted)]">{active.description}</p>
          </div>
          <div className="rounded-2xl border border-[color:var(--home-border)] bg-[color:var(--home-glow)]/8 px-5 py-4 text-right">
            <p className="text-[10px] font-black uppercase tracking-wide text-[color:var(--home-muted)]">Yıllık fiyat</p>
            <p className="mt-1 text-2xl font-black text-[color:var(--home-glow)]">{active.price}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3">
          {(DETAILS[active.label] || []).map((detail) => (
            <div key={detail} className="flex items-start gap-3 rounded-xl border border-[color:var(--home-border)] bg-[color:var(--home-surface)]/60 p-4">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-400" />
              <p className="text-sm leading-6 text-[color:var(--home-ink)]">{detail}</p>
            </div>
          ))}
        </div>

        <a
          href={whatsappLink(`Merhaba, "${active.label}" modülünü lisansıma eklemek istiyorum.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[color:var(--home-glow)] px-5 py-3 text-sm font-black text-slate-950 transition-transform hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle size={16} /> Bu Modülü Talep Et
        </a>
      </section>
    </div>
  );
}
