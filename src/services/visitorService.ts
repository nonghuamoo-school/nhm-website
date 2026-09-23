export interface VisitorStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  popularPages: { path: string; title: string; views: number }[];
  popularNews: { id: string; title: string; views: number; date: string }[];
  dailyTrend: { date: string; day: string; views: number }[];
  monthlyTrend: { month: string; views: number }[];
}

// In-memory or local mock store for visitor metrics
let currentTotalVisits = 12458;

export const visitorService = {
  // Public method to record visit and get current count
  recordVisit: (): number => {
    currentTotalVisits += 1;
    return currentTotalVisits;
  },

  // Public method to fetch current formatted visitor count for the utility bar
  getCurrentCount: (): number => {
    return currentTotalVisits;
  },

  // Admin method to get comprehensive analytical breakdown
  getVisitorStats: (): VisitorStats => {
    return {
      today: 184,
      thisWeek: 1260,
      thisMonth: 4890,
      total: currentTotalVisits,
      popularPages: [
        { path: "/", title: "หน้าแรก (Home)", views: 5840 },
        { path: "/academic", title: "ผลสัมฤทธิ์ทางการศึกษา (O-NET/NT/RT)", views: 2410 },
        { path: "/news", title: "ข่าวประชาสัมพันธ์และกิจกรรม", views: 1890 },
        { path: "/downloads", title: "ดาวน์โหลดเอกสารและแบบฟอร์ม", views: 1120 },
        { path: "/about", title: "ข้อมูลโรงเรียนและประวัติความเป็นมา", views: 780 },
        { path: "/personnel", title: "ทำเนียบครูและบุคลากร", views: 650 },
      ],
      popularNews: [
        {
          id: "news-01",
          title: "เปิดรับสมัครนักเรียนใหม่ ประจำปีการศึกษา 2568 (อ.2 และ ป.1)",
          views: 428,
          date: "18 มี.ค. 2568",
        },
        {
          id: "news-03",
          title: "นักเรียนคว้ารางวัลชนะเลิศ การแข่งขันวิทยาศาสตร์และสิ่งประดิษฐ์",
          views: 512,
          date: "10 มี.ค. 2568",
        },
        {
          id: "news-05",
          title: "กิจกรรมวันไหว้ครู ปลูกฝังความกตัญญูกตเวทิตา",
          views: 340,
          date: "28 ก.พ. 2568",
        },
        {
          id: "news-02",
          title: "กิจกรรมส่งเสริมการอ่านและค่ายพัฒนาทักษะภาษาไทย",
          views: 295,
          date: "14 มี.ค. 2568",
        },
      ],
      dailyTrend: [
        { date: "16 ก.ย.", day: "จันทร์", views: 195 },
        { date: "17 ก.ย.", day: "อังคาร", views: 220 },
        { date: "18 ก.ย.", day: "พุธ", views: 180 },
        { date: "19 ก.ย.", day: "พฤหัสบดี", views: 245 },
        { date: "20 ก.ย.", day: "ศุกร์", views: 210 },
        { date: "21 ก.ย.", day: "เสาร์", views: 115 },
        { date: "22 ก.ย.", day: "อาทิตย์", views: 95 },
      ],
      monthlyTrend: [
        { month: "เม.ย.", views: 2800 },
        { month: "พ.ค.", views: 4650 },
        { month: "มิ.ย.", views: 4120 },
        { month: "ก.ค.", views: 4300 },
        { month: "ส.ค.", views: 4580 },
        { month: "ก.ย.", views: 4890 },
      ],
    };
  },
};
