import type { Metadata } from "next";
import { HelpCenterClient } from "@/components/HelpCenterClient";

export const metadata: Metadata = {
  title: "Kullanıcı Rehberi",
  description:
    "Buneka ile barkod okutma, fiyat görme, ürün ekleme, günlük kasa, stok takibi, veresiye defteri, Excel aktarımı ve lisans ayarlarını adım adım öğrenin.",
  alternates: {
    canonical: "/kullanici-rehberi",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Ana Sayfa",
      item: "https://buneka.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Buneka Yardım Merkezi",
      item: "https://buneka.com/kullanici-rehberi",
    },
  ],
};

export default function KullaniciRehberiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HelpCenterClient />
    </>
  );
}
