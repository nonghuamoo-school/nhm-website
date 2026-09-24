import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { schoolInfo } from "@/data/schoolInfo";

const sarabun = Sarabun({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nhm-website-two.vercel.app"),
  title: {
    template: `%s | ${schoolInfo.name}`,
    default: `${schoolInfo.name} - ${schoolInfo.subAffiliation}`,
  },
  description: `${schoolInfo.name} (${schoolInfo.nameEn}) ${schoolInfo.subAffiliation} ข้อมูลโรงเรียน ข่าวสารประชาสัมพันธ์ ผลการทดสอบระดับชาติ บุคลากรทางการศึกษา`,
  openGraph: {
    title: `${schoolInfo.name} | ${schoolInfo.subAffiliation}`,
    description: `เว็บไซต์ทางการ ${schoolInfo.name} (${schoolInfo.nameEn}) สังกัด ${schoolInfo.subAffiliation} ข้อมูลโรงเรียน ข่าวสารประชาสัมพันธ์ วารสาร และผลงานทางการศึกษา`,
    url: "https://nhm-website-two.vercel.app",
    siteName: schoolInfo.name,
    images: [
      {
        url: "/images/school-hero-gate.png",
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
    images: ["/images/school-hero-gate.png"],
  },
  icons: {
    icon: "/images/school-logo.png",
    apple: "/images/school-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${sarabun.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans">
        <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
      </body>
    </html>
  );
}
