import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Buneka | Barkodu okut, fiyatı gör, satışını bil',
  description:
    'Buneka, küçük işletmeler için yıllık lisanslı barkodla fiyat sorgulama, satış kaydı, kasa ve stok takip sistemidir.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
