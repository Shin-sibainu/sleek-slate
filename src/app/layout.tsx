import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteData } from "@/config/site";
import { Noto_Sans_JP } from "next/font/google";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteData.siteName}`,
    default: siteData.siteName,
  },
  description: siteData.siteDescription,
  keywords: ["Next.js", "Three.js", "FrontEnd"],
  authors: [{ name: "NotionPress", url: siteData.siteUrl }],
  creator: "NotionPress",
  publisher: "NotionPress",
  openGraph: {
    title: siteData.siteName,
    description: siteData.siteDescription,
    url: siteData.siteUrl,
    siteName: siteData.siteName,
    images: [
      { url: `${siteData.siteUrl}/og-image.jpg`, width: 1200, height: 630 },
    ],
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow w-full">
            <div className="max-w-6xl mx-auto px-4">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
