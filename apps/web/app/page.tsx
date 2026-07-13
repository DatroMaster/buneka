import HomeClient from "./HomeClient";

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://buneka.com/#organization",
        name: "Buneka",
        url: "https://buneka.com",
        logo: "https://buneka.com/icon.svg",
        sameAs: ["https://buneka.com"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://buneka.com/#software",
        name: "Buneka",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://buneka.com",
        description:
          "Küçük işletmeler için barkodla fiyat görme, satış kayıtlarını görme, günlük kasa, stok takibi, veresiye ve toplu ürün yönetimi sistemi.",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "TRY",
          lowPrice: "6000",
          highPrice: "24000",
          offerCount: "4",
          url: "https://buneka.com/paketler",
        },
        featureList: [
          "Barkodla fiyat görme",
          "Satış kayıtlarını görme",
          "Günlük kasa takibi",
          "Stok hareketleri",
          "Veresiye takibi",
          "Toplu ürün aktarımı",
          "Barkod okuyucu desteği",
        ],
        publisher: {
          "@id": "https://buneka.com/#organization",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeClient />
    </>
  );
}
