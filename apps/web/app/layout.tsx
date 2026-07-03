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
  title: "Buneka | Barkodu okut, fiyatı gör, satışını bil",
  description:
    "Buneka, küçük işletmeler için yıllık lisanslı barkodla fiyat sorgulama, satış kaydı, kasa ve stok takip sistemidir.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  themeColor: "#F6F8FB",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="buneka-theme-v2">
          {children}
          <FloatingWhatsappSupport />
        </ThemeProvider>
      </body>
    </html>
  );
}
