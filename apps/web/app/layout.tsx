import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Buneka | Barkodu okut, fiyatı gör, satışını bil",
  description:
    "Buneka küçük işletmeler için barkodla fiyat sorgulama, satış kaydı, günlük kasa ve stok hafızasıdır."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
