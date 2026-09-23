import Hero from "@/components/home/Hero";
import SchoolAnalyticsDashboard from "@/components/home/SchoolAnalyticsDashboard";
import LatestNews from "@/components/home/LatestNews";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. ข้อมูลภาพรวมสถานศึกษา (School Overview & Identity) */}
      <Hero />

      {/* 2. โครงสร้างประชากรนักเรียนและการกระจายตัวชั้นเรียน (Student Demographics) */}
      <SchoolAnalyticsDashboard />

      {/* 3. ข่าวประชาสัมพันธ์ (Latest News & Announcements) */}
      <LatestNews />

      {/* 4. ติดต่อและที่ตั้งโรงเรียน (Contact & Map) */}
      <Contact />
    </div>
  );
}
