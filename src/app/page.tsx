import Hero from "@/components/home/Hero";
import LatestNews from "@/components/home/LatestNews";
import NewsletterPosters from "@/components/home/NewsletterPosters";
import SchoolAnalyticsDashboard from "@/components/home/SchoolAnalyticsDashboard";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. ข้อมูลภาพรวมสถานศึกษา (School Overview & Identity) */}
      <Hero />

      {/* 2. ข่าวประชาสัมพันธ์หลัก (Latest News & Announcements - นำขึ้นด้านบน) */}
      <LatestNews />

      {/* 3. ป้ายวารสารประชาสัมพันธ์ A4 (Newsletter Posters - อยู่ใต้ข่าวหลักและเหนือสถิติ/ติดต่อ) */}
      <NewsletterPosters />

      {/* 4. โครงสร้างประชากรนักเรียนและการกระจายตัวชั้นเรียน (Student Demographics) */}
      <SchoolAnalyticsDashboard />

      {/* 5. ติดต่อและที่ตั้งโรงเรียน (Contact & Map) */}
      <Contact />
    </div>
  );
}
