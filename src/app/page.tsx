import Hero from "@/components/home/Hero";
import LatestNews from "@/components/home/LatestNews";
import SchoolAnalyticsDashboard from "@/components/home/SchoolAnalyticsDashboard";
import Contact from "@/components/home/Contact";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. ข้อมูลภาพรวมสถานศึกษา (School Overview & Identity) */}
      <Hero />

      {/* 2. ข่าวประชาสัมพันธ์หลัก (Latest News & Announcements) */}
      <LatestNews />

      {/* 3. โครงสร้างประชากรนักเรียนและการกระจายตัวชั้นเรียน (Student Demographics) */}
      <SchoolAnalyticsDashboard />

      {/* 4. ติดต่อและที่ตั้งโรงเรียน (Contact & Map) */}
      <Contact />
    </div>
  );
}
