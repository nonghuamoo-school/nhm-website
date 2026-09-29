import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { schoolInfo } from "@/data/schoolInfo";
import { getLiveVisitorCountServer } from "@/services/serverVisitorHelper";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1E3A5F",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nhm-website-two.vercel.app"),
  title: {
    template: `%s | ${schoolInfo.name}`,
    default: `${schoolInfo.name} - ${schoolInfo.subAffiliation}`,
  },
  description: `${schoolInfo.name} (${schoolInfo.nameEn}) ${schoolInfo.subAffiliation} ข้อมูลโรงเรียน ข่าวสารประชาสัมพันธ์ ผลการทดสอบระดับชาติ บุคลากรทางการศึกษา`,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: schoolInfo.name,
  },
  openGraph: {
    title: `${schoolInfo.name} | ${schoolInfo.subAffiliation}`,
    description: `เว็บไซต์ทางการ ${schoolInfo.name} (${schoolInfo.nameEn}) สังกัด ${schoolInfo.subAffiliation} ข้อมูลโรงเรียน ข่าวสารประชาสัมพันธ์ วารสาร และผลงานทางการศึกษา`,
    url: "https://nhm-website-two.vercel.app",
    siteName: schoolInfo.name,
    images: [
      {
        url: "/images/school-hero-gate.webp",
        width: 1200,
        height: 630,
        alt: schoolInfo.name,
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${schoolInfo.name} | ${schoolInfo.subAffiliation}`,
    description: `เว็บไซต์ทางการ ${schoolInfo.name} สพป.บุรีรัมย์ เขต 3`,
    images: ["/images/school-hero-gate.webp"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialVisitorCount = await getLiveVisitorCountServer();

  return (
    <html lang="th" className={`${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PublicLayoutWrapper initialVisitorCount={initialVisitorCount}>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
