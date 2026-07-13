import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import { FloatingWhatsappSupport } from "@/components/FloatingWhatsappSupport";
import { ThemeProvider } from "@/components/ThemeProvider";

const overpass = Overpass({
  subsets: ["latin", "latin-ext"],
  variable: "--font-overpass",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://buneka.com"),
  applicationName: "Buneka",
  title: {
    default: "Buneka | Barkodlu Fiyat Görme, Kasa ve Stok Takip Sistemi",
    template: "%s | Buneka",
  },
  description:
    "Buneka, küçük işletmeler için barkodla fiyat görme, satış kayıtlarını görme, günlük kasa, stok takibi, veresiye ve toplu ürün yönetimi sunan pratik işletme takip sistemidir.",
  keywords: [
    "barkodlu fiyat görme",
    "fiyat sorgulama sistemi",
    "küçük işletme stok takip",
    "kasa takip programı",
    "barkod okuyucu fiyat sistemi",
    "market stok takip",
    "veresiye takip programı",
    "ürün fiyat güncelleme",
    "Buneka",
  ],
  authors: [{ name: "Buneka" }],
  creator: "Buneka",
  publisher: "Buneka",
  category: "business software",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://buneka.com",
    siteName: "Buneka",
    title: "Buneka | Barkodlu Fiyat Görme, Kasa ve Stok Takip Sistemi",
    description:
      "Barkodu okutun, fiyatı görün, satış kayıtlarınızı ve stok durumunuzu tek ekrandan takip edin. Küçük işletmeler için sade Buneka işletme takip sistemi.",
  },
  twitter: {
    card: "summary",
    title: "Buneka | Barkodlu Fiyat Görme, Kasa ve Stok Takip Sistemi",
    description:
      "Küçük işletmeler için barkodla fiyat görme, günlük kasa, stok takibi ve satış kayıtlarını görme sistemi.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={overpass.variable}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="buneka-theme-v3">
          {children}
          <FloatingWhatsappSupport />
        </ThemeProvider>
      </body>
    </html>
  );
}
