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
  title: {
    template: `%s | ${schoolInfo.name}`,
    default: `${schoolInfo.name} - ${schoolInfo.subAffiliation}`,
  },
  description: `${schoolInfo.name} (${schoolInfo.nameEn}) ${schoolInfo.subAffiliation} ข้อมูลโรงเรียน ข่าวสารประชาสัมพันธ์ ผลการเรียนและผลสอบ บุคลากรทางการศึกษา`,
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
